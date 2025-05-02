import { DB } from './DB';
import { pgs } from './utils';

export class Service {
    private static successAuth = async (user_id: number) => {
        const { token } = (
            await DB.execChange(`
                INSERT INTO users_auth_tokens (user_id)
                VALUES (${pgs(user_id)})
                RETURNING token;
            `)
        ).rows[0];

        return {
            cookieToken: token,
            userId: user_id,
        };
    };

    public static handleAuth = async (userName, password) => {
        const user = (
            await DB.execSelect(`
            SELECT user_id, password
            FROM users
            WHERE lower(user_name) = lower(${pgs(userName)})
        `)
        ).rows[0];

        if (String(user?.password) === password) {
            return await Service.successAuth(user.user_id);
        }
    };
}
