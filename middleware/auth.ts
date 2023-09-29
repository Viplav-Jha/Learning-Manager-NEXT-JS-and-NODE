import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/radis";

//authenticate user
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    //saving user data in radis
    const user = await redis.get(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    req.user = JSON.parse(user);

    next();
  }
);
//vaidate user role

export const authroizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resourse`,
          403
        )
      );
    }
    next();
  };
};
