 import express from "express";
import { authroizeRole, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders, getOrderAnalytics } from "../controllers/order.controller";
 
 const orderRouter = express.Router();

  orderRouter.post("/create-order",isAuthenticated, createOrder);

  orderRouter.get("/get-orders",isAuthenticated,authroizeRole('admin'), getAllOrders);

  orderRouter.get("/get-orders-analtyics",isAuthenticated,authroizeRole('admin'), getOrderAnalytics);

  export default orderRouter;