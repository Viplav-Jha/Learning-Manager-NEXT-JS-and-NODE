import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

//create layout
export const createLayout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExists = await LayoutModel.findOne({ type });
      if (isTypeExists) {
        return next(new ErrorHandler(`${type} already exits`, 400));
      }
      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "Layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };

        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            console.log(item);
            return { question: item.question, answer: item.answer };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
        console.log("faqItem-create", faqItems);
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            console.log(item);
            return { title: item.title };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
        console.log("categoriesItems", categoriesItems);
      }
      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Edit layout
export const editLayout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subTitle } = req.body;
        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData?.image.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };

        await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            console.log(item);

            return { question: item.question, answer: item.answer };
          })
        );

        await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
        console.log("updated FAQ ", FaqItem);
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItem = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            console.log(item);
            return { title: item.title };
          })
        );
        await LayoutModel.findByIdAndUpdate(categoriesItem?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }
      res.status(200).json({
        success: true,
        message: "Layout Updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get layout by type
export const getlayoutByType = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const layout = await LayoutModel.findOne({ type });
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
