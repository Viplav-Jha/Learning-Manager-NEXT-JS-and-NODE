import express from 'express';
import { activateUser, loginUser, logoutUser, registrationUser } from '../controllers/user.controller';

const userRouter = express.Router();

// Define the registration route
userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login',loginUser);

userRouter.post('/logout',logoutUser);

export default userRouter;
