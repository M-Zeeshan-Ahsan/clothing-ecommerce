import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category_name } = req.body;
    const result = await prisma.category.create({
      data: {
        category_name,
      },
    });
    return handleResponse(res, 201, "Category added successfully", result);
  } catch (error) {
    next(error);
  }
};
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await prisma.category.findMany();
    return handleResponse(res, 200, "Category fetched successfully", result);
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
    });
    if (products.length > 0) {
      throw new ApiError(
        400,
        "Cannot delete category with associated products",
      );
    }
    const result = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!result) {
      throw new ApiError(404, "Category not found");
    }
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
    return handleResponse(res, 200, "Category delete successfully", result);
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
    });
    if (products.length > 0) {
      throw new ApiError(
        400,
        "Cannot update category with associated products",
      );
    }
    const { category_name } = req.body;
    const result = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!result) {
      throw new ApiError(404, "Category not found");
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        category_name,
      },
    });

    return handleResponse(
      res,
      200,
      "Category updated successfully",
      updatedCategory,
    );
  } catch (error) {
    next(error);
  }
};
export const getSpecificCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);
    const result = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!result) {
      throw new ApiError(404, "Category not found");
    }

    return handleResponse(res, 200, "Category fetched successfully", result);
  } catch (error) {
    next(error);
  }
};
