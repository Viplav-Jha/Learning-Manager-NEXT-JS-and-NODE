import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

// Register user
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

      // Create a new user
      const user: IUser = new userModel({ name, email, password });

      // Save the user to the database
      await user.save();

      // Generate an activation token
      const activationToken = createActivationToken(user);

      // Extract the activation code from the token
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };

      // Render the email template
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      // Send the activation email
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      // Respond with a success message and the activation token
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
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
export const createActivationToken = (user: IUser): IActivationToken => {
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

// activate





























