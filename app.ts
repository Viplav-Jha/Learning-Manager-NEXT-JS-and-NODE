import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import { courseRouter } from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notification from "./routes/notification.route";

require("dotenv").config();

export const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.ORIGIN || "*", // Allow requests from any origin by default
  })
);

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Routes
// app.use("/api/v1", userRouter); // Added a missing forward slash before "api/v1"
// app.use("/api/v1", courseRouter);
// app.use("api/v1",orderRouter)
// app.use("api/v1",notification)

//one line route
app.use("/api/v1", userRouter,courseRouter,orderRouter,notification);

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error handling middleware should be registered last
app.use(ErrorMiddleware);

export default app;
