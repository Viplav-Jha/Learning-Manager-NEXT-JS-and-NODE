import express from 'express';
import { authroizeRole, isAuthenticated } from '../middleware/auth';
import { createLayout, editLayout, getlayoutByType } from '../controllers/layout.controller';

const layoutRouter = express.Router();

layoutRouter.post("/create-layout",isAuthenticated,authroizeRole("admin"),createLayout);

layoutRouter.put("/edit-layout",isAuthenticated,authroizeRole("admin"),editLayout);

layoutRouter.get("/get-layout",isAuthenticated,getlayoutByType);


export default layoutRouter;