//get user by id

import { NextFunction, Response } from "express";
import { userModel } from "../models/user.model";
import { redis } from "../utils/radis";

export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);

    res.status(201).json({
      success: true,
      user,
    });
  }
};


//Get All users  -- only admin
export const getAllUsersServices = async (res:Response) =>{
  const userJSON =await redis.get("user");
  const users =await userModel.find().sort({createdAt:-1});

  res.status(201).json({
    status:true,
    users,
    userJSON,
  });
};

//update user role
export const updateUserRoleService = async (res:Response,id:string,role:string)=>{
  const user = await userModel.findByIdAndUpdate(id,{role},{new:true});

  res.status(201).json({
    success:true,
    user,
  });
};




