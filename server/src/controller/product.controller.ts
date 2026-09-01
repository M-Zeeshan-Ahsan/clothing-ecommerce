import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { product_name, product_image, categoryId } = req.body;
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    const result = await prisma.product.create({
      data: {
        product_name,
        product_image,
        categoryId,
      },
    });
    return handleResponse(res, 201, "Product added successfully", result);
  } catch (error) {
    next(error);
  }
};
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            category_name: true,
          },
        },
      },
    });

    const total = await prisma.product.count();

    return handleResponse(res, 200, "Products fetched successfully", {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const productId = Number(id);
    const { product_name, product_image, categoryId } = req.body;
    const result = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!result) {
      throw new ApiError(404, "Product not found");
    }
    const existingProduct = await prisma.product.findFirst({
      where: {
        product_name,
        NOT: {
          id: productId,
        },
      },
    });

    if (existingProduct) {
      throw new ApiError(409, "Product name already exists");
    }
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        product_name,
        product_image,
        categoryId,
      },
    });

    return handleResponse(
      res,
      200,
      "Product updated successfully",
      updatedProduct,
    );
  } catch (error) {
    next(error);
  }
};
export const getSpecificProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const productId = Number(id);
    const result = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: {
          select: {
            id: true,
            category_name: true,
          },
        },
      },
    });

    if (!result) {
      throw new ApiError(404, "Product not found");
    }

    return handleResponse(res, 200, "Product fetched successfully", result);
  } catch (error) {
    next(error);
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const productId = Number(id);
    const result = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!result) {
      throw new ApiError(404, "Product not found");
    }
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return handleResponse(res, 200, "Product delete successfully", result);
  } catch (error) {
    next(error);
  }
};
export const deleteMultipleProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = req.body;
    const productIds = ids.map((id: string) => Number(id));
    const result = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    if (result.length !== productIds.length) {
      throw new ApiError(404, "One or more products not found");
    }
    await prisma.product.deleteMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    return handleResponse(res, 200, "Products deleted successfully", result);
  } catch (error) {
    next(error);
  }
};
