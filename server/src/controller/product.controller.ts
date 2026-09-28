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
    const { product_name, product_image, categoryId, price, sale_price } =
      req.body;

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (
      sale_price !== undefined &&
      sale_price !== null &&
      sale_price >= price
    ) {
      throw new ApiError(400, "Sale price must be less than original price");
    }

    const result = await prisma.product.create({
      data: {
        product_name,
        product_image,
        categoryId,
        price,
        sale_price,
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

    const search = String(req.query.search || "").trim();

    const categoryId = Number(req.query.categoryId) || undefined;

    const newOnly = req.query.newOnly === "true";
    const saleOnly = req.query.saleOnly === "true";

    // =========================
    // 5 DAYS AGO
    // =========================

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // =========================
    // WHERE
    // =========================

    const where = {
      // Search
      ...(search && {
        product_name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }),

      // Category ID
      ...(categoryId && {
        categoryId,
      }),

      // New products only
      ...(newOnly && {
        createdAt: {
          gte: fiveDaysAgo,
        },
      }),

      // Sale products only
      ...(saleOnly && {
        sale_price: {
          not: null,
        },
      }),
    };

    // =========================
    // GET PRODUCTS
    // =========================

    const products = await prisma.product.findMany({
      where,

      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        createdAt: "desc",
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

    // =========================
    // PRODUCT DETAILS
    // =========================

    const productsWithDetails = products.map((product) => {
      const price = Number(product.price);

      const salePrice =
        product.sale_price !== null ? Number(product.sale_price) : null;

      const isNew = product.createdAt >= fiveDaysAgo;

      const isSale = salePrice !== null;

      const currentPrice = salePrice ?? price;

      const savedAmount = salePrice !== null ? price - salePrice : 0;

      const discountPercentage =
        salePrice !== null
          ? Math.round(((price - salePrice) / price) * 100)
          : 0;

      let badge: string | null = null;

      if (isNew && isSale) {
        badge = "NEW & SALE";
      } else if (isNew) {
        badge = "NEW";
      } else if (isSale) {
        badge = "SALE";
      }

      return {
        ...product,
        price,
        sale_price: salePrice,
        current_price: currentPrice,
        saved_amount: savedAmount,
        discount_percentage: discountPercentage,
        badge,
      };
    });

    // =========================
    // TOTAL
    // =========================

    const total = await prisma.product.count({
      where,
    });

    // =========================
    // RESPONSE
    // =========================

    return handleResponse(res, 200, "Products fetched successfully", {
      products: productsWithDetails,

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

    if (!productId) {
      throw new ApiError(400, "Invalid product ID");
    }

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const product = await prisma.product.findUnique({
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

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const price = Number(product.price);

    const salePrice =
      product.sale_price !== null ? Number(product.sale_price) : null;

    const isNew = product.createdAt >= fiveDaysAgo;
    const isSale = salePrice !== null;

    const currentPrice = salePrice ?? price;

    const savedAmount = salePrice !== null ? price - salePrice : 0;

    const discountPercentage =
      salePrice !== null ? Math.round(((price - salePrice) / price) * 100) : 0;

    let badge: string | null = null;

    if (isNew && isSale) {
      badge = "NEW & SALE";
    } else if (isNew) {
      badge = "NEW";
    } else if (isSale) {
      badge = "SALE";
    }

    const productWithDetails = {
      ...product,
      price,
      sale_price: salePrice,
      current_price: currentPrice,
      saved_amount: savedAmount,
      discount_percentage: discountPercentage,
      badge,
    };

    return handleResponse(
      res,
      200,
      "Product fetched successfully",
      productWithDetails,
    );
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
export const getAllProductsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const take = limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: {
            select: {
              id: true,
              category_name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),

      prisma.product.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return handleResponse(res, 200, "All products fetched successfully", {
      products,
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
