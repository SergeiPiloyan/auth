import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import { ALLOWED_ORIGINS, CORS_MAX_AGE } from "./const";

export class App {
  public static init() {
    const app: Application = express();
    const port = process.env.PORT || 5051;

    app.disable("x-powered-by");
    app.use(compression());
    app.use(express.json({ limit: "1mb" }));

    app.use(
      cors({
        maxAge: CORS_MAX_AGE,
        origin: (origin, callback) => {
          if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
          }

          return callback(
            new Error("CORS policy: This origin is not allowed."),
            false
          );
        },
      })
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (!["BadRequestError"].includes(err?.name)) {
        console.log("Handled error in index.ts", { err, headers: req.headers });
      }
      res.status(500).send("Something is wrong in the request format..");
    });

    app.listen(port, () => console.log(`Server is running on ${port}`));

    return app;
  }
}
