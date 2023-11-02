import { NextFunction, Request, Response } from "express";
import md5 from "md5";

const tokenAuth = (req: Request, res: Response, next: NextFunction) => {
  const handleUnauthorized = () => {
    res.status(401).json({
      success: false,
      message: "Unautorized",
    });
  };

  const authorization = req.headers.authorization;
  const token = (authorization || "").split(" ")?.[1];

  if (!process.env.PASSWORD) {
    return next();
  }

  if (token !== md5(process.env.PASSWORD)) {
    handleUnauthorized();
  } else {
    next();
  }
};

export default tokenAuth;
