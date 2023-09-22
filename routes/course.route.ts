import express from "express";
import { editCourse, uploadCourse } from "../controllers/course.controller";
import { authroizeRole, isAuthenticated } from "../middleware/auth";

export const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authroizeRole("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authroizeRole("admin"),
  editCourse
);
