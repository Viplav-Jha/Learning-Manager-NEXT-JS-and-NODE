import express, { NextFunction } from "express";
import {
    addAnswer,
  addQuestion,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
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

courseRouter.get(
  "/get-course/:id",
  getSingleCourse,
);

courseRouter.get(
  "/get-courses",
  getAllCourses,
);

courseRouter.get(
  "/get-course-content/:id",
  isAuthenticated,
  getCourseByUser,
); //need to work

courseRouter.put(
  "/add-question",
  isAuthenticated,
  addQuestion,
);

courseRouter.put(
    "/add-answer",
    isAuthenticated,
    addAnswer,
  );