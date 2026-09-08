import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      sales,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.product.count(),

      prisma.category.count(),

      prisma.order.count(),

      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.order.count({
        where: {
          status: "CONFIRMED",
        },
      }),

      prisma.order.count({
        where: {
          status: "SHIPPED",
        },
      }),

      prisma.order.count({
        where: {
          status: "DELIVERED",
        },
      }),

      prisma.order.count({
        where: {
          status: "CANCELLED",
        },
      }),

      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            not: "CANCELLED",
          },
        },
      }),
    ]);

    return handleResponse(res, 200, "Dashboard stats fetched successfully", {
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,

      orders: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },

      totalSales: sales._sum.totalAmount || 0,
    });
  } catch (error) {
    next(error);
  }
};
