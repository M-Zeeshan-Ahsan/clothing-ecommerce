import { Request, Response, NextFunction } from "express";

import cloudinary from "../config/cloudinary.js";

export const uploadImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "libaas/products",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        },
      );

      stream.end(req.file!.buffer);
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("CLOUDINARY ERROR:", error);
    next(error);
  }
};
