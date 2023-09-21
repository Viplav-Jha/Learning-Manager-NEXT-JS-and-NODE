require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./radis";
import jwt from "jsonwebtoken";

interface ITokenOptions {
  expire: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite?: "lax" | "strict" | "none" | undefined;
  secure: boolean;
}

//parse environment variable to intergrates with fallback values
export const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
export const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);
console.log("----accessTokenExpire-------", accessTokenExpire);
console.log("----refreshTokenExpire-------", refreshTokenExpire);

//options for cookies
export const accessTokenOptions: ITokenOptions = {
  expire: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};
console.log("----accessTokenOptions-------", accessTokenOptions);

export const refreshTokenOptions: ITokenOptions = {
  expire: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

// error handling for expire token


  //upload session to radis
  redis.set(user._id, JSON.stringify(user) as any);

  //only set secure to true in production

  if (process.env.NODE_ENV == "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
