import { Request, Response } from "express";

export class Controllers {
  public static async handleAuth(req: Request, res: Response) {
    res.send("handle auth is working");
  }
}
