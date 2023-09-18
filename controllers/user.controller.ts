import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

// Register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      // Check if the email already exists
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Create a new user object
      const newUser: IRegistrationBody = {
        name,
        email,
        password,
      };

      // Generate an activation token
      const activationToken = createActivationToken(newUser);

      // Extract the activation code from the token
      const activationCode = activationToken.activationCode;

      const data = { user: { name: newUser.name }, activationCode };

      // Render the email template
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      // Send the activation email
      await sendMail({
        email: newUser.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      // Respond with a success message and the activation token
      res.status(201).json({
        success: true,
        message: `Please check your email: ${newUser.email} to activate your account!`,
        activationToken: activationToken.token,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, error.statusCode || 400));
    }
  }
);

// Interface for the activation token
interface IActivationToken {
  token: string;
  activationCode: string;
}

// Function to create an activation token
export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// activate user
interface IActivationTokenRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationTokenRequest;

      const decodedToken: {
        user: IRegistrationBody;
        activationCode: string;
      } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as {
        user: IRegistrationBody;
        activationCode: string;
      };

      if (decodedToken.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = decodedToken.user;

      // Check if the email already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      // Create a new user with the provided data
      const user = await userModel.create({
        name,
        email,
        password,
      });

      // Respond with a success message
      res.status(201).json({
        success: true,
        message: "Account activated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
