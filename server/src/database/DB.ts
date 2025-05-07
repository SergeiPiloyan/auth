import { Md5 } from "md5-typescript";
import { Pool, PoolClient, PoolConfig, QueryResult } from "pg";
import NodeCache from "node-cache";

export interface IQueryResultCachable<T extends { [key: string]: any } = any>
  extends QueryResult<T> {
  tables: string[];
  query: string;
  notices: string[];
  cached: boolean;
}

const MAX_CONNECTIONS_PER_POOL = 30;

export class DB {
  private static pool: Pool;
  private static cache: NodeCache | null = null;

  private static getPoolConfig(): PoolConfig {
    const cfg: PoolConfig = {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      statement_timeout: 5 * 60 * 1000,
      idleTimeoutMillis: 10 * 60 * 1000,
      max: MAX_CONNECTIONS_PER_POOL,
    };
    // console.log(dbType, cfg);

    const configForLog = {
      ...cfg,
      user: cfg.user as string, //?.substring(0, 2) + "****",
      password: cfg.password as string, //?.substring(0, 2) + "****",
    };

    console.log(
      `DB: connections details for DB config ` + JSON.stringify(configForLog)
    );

    // Logger.always(`DB: connections details for DB config ` + JSON.stringify(configForLog), {}, true);
    return cfg;
  }

  private static async getPoolClient(): Promise<PoolClient> {
    if (this.pool === undefined) {
      this.pool = new Pool(this.getPoolConfig());

      try {
        console.log("First time connection to DB");

        const client = await this.pool.connect();
        client.release();
      } catch (error) {
        throw new Error(`DB: Failed to connect to DB`);
      }
    }

    const poolInfoBefore = {
      idleCount: this.pool.idleCount,
      totalCount: this.pool.totalCount,
      waitingCount: this.pool.waitingCount,
    };
    const _tStart = process.hrtime();
    const client = await this.pool.connect();
    const _tEnd = process.hrtime(_tStart);
    const _tMsPassed = Math.round(_tEnd[0] * 1000 + _tEnd[1] / 1000000);

    const poolInfoafter = {
      idleCount: this.pool.idleCount,
      totalCount: this.pool.totalCount,
      waitingCount: this.pool.waitingCount,
    };

    if (_tMsPassed > 500) {
      // console.log(`Took ${_tMsPassed} to get client from pool for: ${this.pool.idleCount} idle, ${this.pool.totalCount} total, ${this.pool.waitingCount} waiting`, {
      //     data: { poolInfoBefore, poolInfoafter },
      // });
    }

    return client;
  }

  private static async doQuery(
    query: string,
    values: any[]
  ): Promise<IQueryResultCachable> {
    const notices: string[] = [];

    // NoticeMessage change type
    const onNotice = (n: any) => {
      notices.push(n.message);
    };

    const pgClient = await DB.getPoolClient();
    pgClient.on("notice", onNotice);

    try {
      const data = (await pgClient.query(
        query,
        values
      )) as IQueryResultCachable;
      data.notices = notices;

      pgClient.removeListener("notice", onNotice);
      pgClient.release();

      return data;
    } catch (error) {
      await pgClient.query("ROLLBACK");
      pgClient.removeListener("notice", onNotice);
      pgClient.release();
      throw error;
    }
  }

  private static async query(
    query: string,
    isSelect: boolean,
    cacheTTLSeconds: number,
    values: any[]
  ): Promise<IQueryResultCachable> {
    if (this.cache === null) {
      this.cache = new NodeCache();
    }

    const cacheKey = Md5.init(query + "/" + JSON.stringify(values));

    let data = (
      cacheTTLSeconds > -1 ? this.cache.get(cacheKey) : undefined
    ) as IQueryResultCachable;

    if (data !== undefined) {
      return DB.decompressData(data);
    }

    try {
      const tStart = process.hrtime();

      const resData: IQueryResultCachable = await DB.doQuery(query, values);

      const tEnd = process.hrtime(tStart);
      const tMsElapsed = Math.round(tEnd[0] * 1000 + tEnd[1] / 1000000);

      data = {
        command: resData?.command,
        fields: resData?.fields,
        rows: resData?.rows,
        rowCount: resData?.rowCount,
        notices: resData?.notices || [],
        tables: [],
        query,
        cached: true,
        // in new version we have to use oid but need to investigate
      } as unknown as IQueryResultCachable as any;

      if (tMsElapsed > 10000) {
        console.log("Too long to execute SQL " + tMsElapsed, {
          sql: query.substring(0, 100),
          result_rows_count: data.rowCount,
        });
      }

      if (isSelect) {
        if (cacheTTLSeconds > -1) {
          data.cached = true;
          this.cache.set(cacheKey, DB.compressData(data), cacheTTLSeconds);
        }
      }
      data.cached = false;
    } catch (error) {
      console.log("DB: error executing sql", {
        sql: query.substring(0, 3000),
        values,
        error,
      });
      throw error;
    }

    return data;
  }

  private static compressData(
    data: IQueryResultCachable
  ): IQueryResultCachable {
    const rompressedRows = data.rows.map((r) => {
      const rowArr: any[] = [];
      data.fields.forEach((f) => {
        rowArr.push(r[f.name]);
      });
      return rowArr;
    });
    return {
      ...data,
      rows: rompressedRows,
    };
  }

  private static decompressData(
    data: IQueryResultCachable
  ): IQueryResultCachable {
    const decompressedRows = data.rows.map((r) => {
      const rowObj: any = {};
      data.fields.forEach((f, i) => {
        rowObj[f.name] = r[i];
      });
      return rowObj;
    });
    return {
      ...data,
      rows: decompressedRows,
    };
  }

  public static async execSelect(
    cmd: string,
    cacheTTLSeconds: number = -1,
    { ignoreOperationTypeCheck }: { ignoreOperationTypeCheck: boolean } = {
      ignoreOperationTypeCheck: false,
    }
  ): Promise<IQueryResultCachable> {
    if (!ignoreOperationTypeCheck) {
      if (
        cmd.indexOf("UPDATE") !== -1 ||
        cmd.indexOf("INSERT") !== -1 ||
        cmd.indexOf("DELETE") !== -1
      ) {
        console.log(`SQL change operation in CJMDB.execSelect, ${cmd}`);

        // Logger.error(`SQL change operation in CJMDB.execSelect, ${cmd}`);
      }
    }
    return await this.query(cmd, true, cacheTTLSeconds, []);
  }

  public static async execChange<T extends {} = any>(
    cmd: string,
    cacheTTLSeconds: number = -1
  ): Promise<IQueryResultCachable<T>> {
    try {
      return await this.query(cmd, false, cacheTTLSeconds, []);
    } catch (err: any) {
      if (
        err.routine === "ExecConstraints" ||
        err.code == "23505" ||
        err.code == "23503"
      ) {
        console.log("Error executing DB.execChange", { cmd, err });
        // Logger.info("Error executing DB.execChange", { cmd, err });
      } else {
        console.log("Error executing DB.execChange", { cmd, err });
        // Logger.error("Error executing DB.execChange", { cmd, err });
      }
      throw err;
    }
  }
}
