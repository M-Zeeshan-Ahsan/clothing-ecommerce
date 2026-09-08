import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client.js";
import ApiError from "../utils/ApiError.js";

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "ADMIN") {
      throw new ApiError(403, "Access denied. Admin only");
    }

    next();
  } catch (error) {
    next(error);
  }
};
