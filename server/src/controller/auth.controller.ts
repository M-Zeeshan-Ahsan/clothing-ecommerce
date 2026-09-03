import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    console.log("test", req.body);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }
    console.log("isMatch", isMatch);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return handleResponse(res, 200, "User logged in successfully", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new ApiError(401, "Refresh token is required");
    }

    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new ApiError(500, "JWT refresh secret is not configured");
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.refreshToken !== token) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    return handleResponse(res, 200, "Tokens refreshed successfully", {
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};
