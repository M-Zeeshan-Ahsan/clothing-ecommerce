import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

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
export const getAllContactMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.contactMessage.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return handleResponse(res, 200, "Contact messages fetched successfully", {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET SINGLE CONTACT MESSAGE
// =========================

export const getContactMessageById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messageId = Number(req.params.id);

    if (!Number.isInteger(messageId) || messageId <= 0) {
      throw new ApiError(400, "Invalid contact message ID");
    }

    const contactMessage = await prisma.contactMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!contactMessage) {
      throw new ApiError(404, "Contact message not found");
    }

    return handleResponse(
      res,
      200,
      "Contact message fetched successfully",
      contactMessage,
    );
  } catch (error) {
    next(error);
  }
};

// =========================
// MARK CONTACT MESSAGE AS READ
// =========================

export const markContactMessageAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messageId = Number(req.params.id);

    if (!Number.isInteger(messageId) || messageId <= 0) {
      throw new ApiError(400, "Invalid contact message ID");
    }

    const contactMessage = await prisma.contactMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!contactMessage) {
      throw new ApiError(404, "Contact message not found");
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: {
        id: messageId,
      },
      data: {
        isRead: true,
      },
    });

    return handleResponse(
      res,
      200,
      "Contact message marked as read",
      updatedMessage,
    );
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE CONTACT MESSAGE
// =========================

export const deleteContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const messageId = Number(req.params.id);

    if (!Number.isInteger(messageId) || messageId <= 0) {
      throw new ApiError(400, "Invalid contact message ID");
    }

    const contactMessage = await prisma.contactMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!contactMessage) {
      throw new ApiError(404, "Contact message not found");
    }

    await prisma.contactMessage.delete({
      where: {
        id: messageId,
      },
    });

    return handleResponse(
      res,
      200,
      "Contact message deleted successfully",
      null,
    );
  } catch (error) {
    next(error);
  }
};
export const getUnreadContactMessageCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const unreadCount = await prisma.contactMessage.count({
      where: {
        isRead: false,
      },
    });

    return handleResponse(
      res,
      200,
      "Unread contact message count fetched successfully",
      {
        unreadCount,
      },
    );
  } catch (error) {
    next(error);
  }
};
