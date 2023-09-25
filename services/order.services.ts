import { NextFunction,Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import OrderModel from "../models/orderModel";

//create new order
export const newOrder = catchAsyncError(async(data:any,next:NextFunction,res:Response)=>{
    const order = await OrderModel.create(data);
    res.status(201).json({
        success:true,
        order,
       })
 
})

