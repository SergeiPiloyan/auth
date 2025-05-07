import { Request, Response } from 'express';
import { Service } from '../services/services';

export class Controllers {
    public static async handleAuth(req: Request, res: Response) {
        const { user_name, password }: { user_name: string; password: string } = req.body;

        if (!user_name || !password) {
            res.status(400).json({ errorCode: 400, error_message: 'Wrong credentials' });
        }

        const trimmedUserName = user_name?.trim();
        const trimmedPassword = password?.trim();

        let processedAuth;

        if (req.path === '/auth') {
            processedAuth = await Service.handleAuth(trimmedUserName, trimmedPassword);
        } else {
            processedAuth = await Service.registration(trimmedUserName, trimmedPassword);
        }

        Controllers.sendJSON(res, processedAuth);
    }

    public static async logout(req: Request, res: Response) {
        const { token }: { token: string } = req.body;

        await Service.logout(token);
        Controllers.sendJSON(res);
    }

    private static sendJSON(res: Response, json: any = undefined, cacheAge: number = 0) {
        res.setHeader('Cache-Control', `public, max-age=${cacheAge}`);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Expose-Headers', `Content-Range,Content-Type`);

        res.json({ errorCode: 0, data: json });

        res.end();
    }
}
