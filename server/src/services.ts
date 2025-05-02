import { DB } from './DB';
import { pgs } from './utils';

export class Service {
    public static handleAuth = async (userName, password) => {
        const user = (
            await DB.execSelect(`
            SELECT user_id, password
            FROM users
            WHERE lower(user_name) = lower(${pgs(userName)})
        `)
        ).rows[0];

        console.log(user);
    };
}
