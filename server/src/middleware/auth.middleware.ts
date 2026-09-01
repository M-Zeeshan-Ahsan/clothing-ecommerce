import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

interface JwtPayload {
  id: number;
  email: string;
}

const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Token required");
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      throw new ApiError(401, "Token required");
    }

    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new ApiError(500, "JWT access secret is not configured");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Invalid token"));
      return;
    }

    next(error);
  }
};

export default verifyToken;
