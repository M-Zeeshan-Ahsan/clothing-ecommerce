import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return handleResponse(res, 201, "User added successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();
    return handleResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return handleResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteMultipleUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = req.body;
    const userIds = ids.map((id: string) => Number(id));
    const result = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    if (result.length !== userIds.length) {
      throw new ApiError(404, "One or more users not found");
    }
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    return handleResponse(res, 200, "Users deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const specificUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return handleResponse(res, 200, "Profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};
