import express from "express";
import { authroizeRole, isAuthenticated } from "../middleware/auth";
import { getUserAnalytics } from "../controllers/analytics.controller";

const analyticsRouter = express.Router();

analyticsRouter.get("/get-user-analytics",isAuthenticated,authroizeRole("admin"),getUserAnalytics);

export default analyticsRouter;

