import express, { NextFunction } from "express";
import {
    addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourse,
  getAllCourses,
  getCourseAnalytics,
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
  courseRouter.put(
    "/add-review/:id",
    isAuthenticated,
    addReview,
  );

  courseRouter.put(
    "/add-reply",
    isAuthenticated,
    authroizeRole("admin"),
    addReplyToReview,
  );
  courseRouter.get(
    "/add-courses",
    isAuthenticated,
    authroizeRole("admin"),
    getAllCourses,
  );
  courseRouter.delete(
    "/delete-course/:id",
    isAuthenticated,
    authroizeRole("admin"),
    deleteCourse,
  );
  courseRouter.get(
    "/get-courses-analytics",
    isAuthenticated,
    authroizeRole("admin"),
    getCourseAnalytics,
  );

