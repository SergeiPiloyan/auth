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

    public static registration = async (userName: string, password: string) => {
        const user = (
            await DB.execSelect(`
            SELECT user_id, password
            FROM users
            WHERE lower(user_name) = lower(${pgs(userName)})
        `)
        ).rows[0];

        if (user) {
            return {
                message: 'User is excited',
            };
        } else {
            await DB.execSelect(`
                INSERT INTO users (user_name, password)
                VALUES (${pgs(userName)}, ${pgs(password)})
            `);

            return {
                message: 'Registration was successful',
            };
        }
    };

    public static handleAuth = async (userName: string, password: string) => {
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

        return {
            message: 'Wrong username or password',
        };
    };

    public static logout = async (cookieToken: string) => {
        await DB.execChange(`
            UPDATE users_auth_tokens
            SET is_active = false
            WHERE token = ${pgs(cookieToken)}
        `);
    };
}
