import { NextFunction,Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import OrderModel from "../models/orderModel";
import CourseModel from "../models/course.model";

//create new order
export const newOrder = catchAsyncError(async(data:any,next:NextFunction,res:Response)=>{
    const order = await OrderModel.create(data);
    res.status(201).json({
        success:true,
        order,
       })
 
})

//Get All Order
export const getOrderServices = async (res:Response) =>{
    const orders =await OrderModel.find().sort({createdAt:-1});
  
    res.status(201).json({
      status:true,
      orders,
    });
  };
