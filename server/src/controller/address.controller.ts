import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const { fullName, phone, address, city, postalCode } = req.body;

    const newAddress = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        address,
        city,
        postalCode,
      },
    });

    return handleResponse(res, 201, "Address created successfully", newAddress);
  } catch (error) {
    next(error);
  }
};
export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return handleResponse(
      res,
      200,
      "Addresses fetched successfully",
      addresses,
    );
  } catch (error) {
    next(error);
  }
};
export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const addressId = Number(req.params.id);

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    return handleResponse(res, 200, "Address fetched successfully", address);
  } catch (error) {
    next(error);
  }
};
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const addressId = Number(req.params.id);

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    const { fullName, phone, address, city, postalCode } = req.body;

    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        fullName,
        phone,
        address,
        city,
        postalCode,
      },
    });

    return handleResponse(
      res,
      200,
      "Address updated successfully",
      updatedAddress,
    );
  } catch (error) {
    next(error);
  }
};
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const addressId = Number(req.params.id);

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return handleResponse(res, 200, "Address deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
