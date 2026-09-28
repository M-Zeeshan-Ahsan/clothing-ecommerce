import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";

export const createContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, phone, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email || null,
        phone,
        message,
      },
    });

    return handleResponse(
      res,
      201,
      "Your message has been sent successfully",
      contactMessage,
    );
  } catch (error) {
    next(error);
  }
};
