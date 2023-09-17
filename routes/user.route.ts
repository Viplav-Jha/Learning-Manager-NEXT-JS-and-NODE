import express from 'express';
import { registrationUser } from '../controllers/user.controller';

const userRouter = express.Router();

// Define the registration route
userRouter.post('/registration', registrationUser);

export default userRouter;
