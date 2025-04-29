import Router from "express";
import { Request, Response } from "express";
import { Controllers } from "./controllers";

const apiRouter = () => {
  const router = Router();

  router.get("/health", (req: Request, res: Response) => {
    res.send("Server is working");
  });

  router.post("/auth", Controllers.handleAuth);

  return router;
};

export default apiRouter();
