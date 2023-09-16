import { NextFunction, Request, Response } from "express";
import { ErrorHandle } from "../utils/ErrorHandler";

  export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  // wrong mongodb id Error
  if (err.name === "CasteError") {
    const message = `Resource not found. Invaild: ${err.path}`;
    err = new ErrorHandle (message, 400);
  }

   // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandle(message, 400);
  }

  // wrong jwt error
  if (err.name === "jsonwebtokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandle(message, 400);
  }

  //JWT  expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired , try again`;
    err = new ErrorHandle(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
