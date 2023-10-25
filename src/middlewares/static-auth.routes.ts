import { NextFunction, Request, Response } from "express";

const staticAuth = (req: Request, res: Response, next: NextFunction) => {
  const handleUnauthorized = () => {
    res.status(401).json({
      success: false,
      message: "Unautorized",
    });
  };

  const authorization = req.headers.authorization;
  const token = (authorization || "").split(" ")?.[1];
  const staticToken = process.env.STATIC_TOKEN;

  if (!staticToken) {
    return next();
  }

  if (token !== staticToken) {
    handleUnauthorized();
  } else {
    next();
  }
};

export default staticAuth;
