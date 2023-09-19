require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./radis";

interface ITokenOptions {
    expire:Date;
    maxAge:number;
    httpOnly:boolean;
    sameSite?: 'lax' | 'strict' | 'none' | undefined;
    secure:boolean;
}

export const sendToken =(user:IUser,statusCode:number,res:Response) =>{

    try {
        const accessToken =user.SignAccessToken();
        const refreshToken =user.SignRefreshToken();
    
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
    
        //upload session to radis 
         redis.set(user._id,JSON.stringify(user) as any );
    
        //parse environment variable to intergrates with fallback values
        const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300' ,10)
        const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200' ,10)
        console.log("----accessTokenExpire-------",accessTokenExpire);
        console.log("----refreshTokenExpire-------",refreshTokenExpire)
    
        //options for cookies
        const accessTokenOptions: ITokenOptions ={
            expire: new Date(Date.now() + accessTokenExpire * 1000),
            maxAge: accessTokenExpire * 1000,
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        };
        console.log("----accessTokenOptions-------",accessTokenOptions)
    
        const refreshTokenOptions: ITokenOptions ={
            expire: new Date(Date.now() + refreshTokenExpire * 1000),
            maxAge: refreshTokenExpire * 1000,
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        };
    
        //only set secure to true in production
    
        if(process.env.NODE_ENV =='production') {
            accessTokenOptions.secure =true
        }
    
        res.cookie("access_token",accessToken, accessTokenOptions);
        res.cookie("refresh_token",refreshToken,refreshTokenOptions);
        
        res.status(statusCode).json({
            success:true,
            user,
            accessToken,
        })
    

    }catch(error){
        console.error("Error in sendToken:", error);
    }
   
}