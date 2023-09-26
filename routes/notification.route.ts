import express from "express";
import { authroizeRole, isAuthenticated } from "../middleware/auth";
import { getNotification, updateNotifications } from "../controllers/notifcation.controller";

const notification = express.Router();

notification.get(
  "/get-all-notification",
  isAuthenticated,
  authroizeRole("admin"),
  getNotification
);

notification.put("/update-notifications/:id",isAuthenticated,authroizeRole("admin"),updateNotifications)

export default notification;
