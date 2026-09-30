import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import prisma from "../prisma/client.js";
import handleResponse from "../utils/response.js";

export const subscribeNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingSubscriber) {
      throw new ApiError(400, "This email is already subscribed");
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
      },
    });

    return handleResponse(res, 201, "Subscribed successfully", subscriber);
  } catch (error) {
    next(error);
  }
};
