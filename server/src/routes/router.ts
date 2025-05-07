import Router from 'express';
import { Request, Response } from 'express';
import { Controllers } from '../controllers/controllers';

const apiRouter = () => {
    const router = Router();

    router.get('/health', (req: Request, res: Response) => {
        res.send('Server is working');
    });

    router.post('/auth', Controllers.handleAuth);

    router.post('/logout', Controllers.logout);

    router.post('/registration', Controllers.registration);

    return router;
};

export default apiRouter();
