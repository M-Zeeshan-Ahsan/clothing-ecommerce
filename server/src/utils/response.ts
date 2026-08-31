import { Response } from "express";

const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export default handleResponse;
