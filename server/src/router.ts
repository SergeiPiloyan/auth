import Router from "express";
import { Request, Response } from "express";

const apiRouter = () => {
  const router = Router();

  router.get("/health", (req: Request, res: Response) => {
    res.send("Server is working");
  });

  return router;
};

export default apiRouter();
