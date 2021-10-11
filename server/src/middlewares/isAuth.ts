import { NextFunction, Request, Response } from "express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    console.error("[isAuth] user not authenticated. ID= ", req.session.userId);
    return res.json({ error: "not authenticated" });
  }
  return next();
};
