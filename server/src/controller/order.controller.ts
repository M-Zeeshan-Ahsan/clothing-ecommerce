import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { addressId } = req.body;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    if (cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
      },
    });

    for (const item of cart.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return handleResponse(res, 201, "Order created successfully", order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const take = limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          address: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),

      prisma.order.count({
        where: {
          userId,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return handleResponse(res, 200, "Orders fetched successfully", {
      orders,
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
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const orderId = Number(id);
    const userId = req.user!.id;
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return handleResponse(res, 200, "Order fetched successfully", order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const orderId = Number(id);
    const { status } = req.body;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return handleResponse(
      res,
      200,
      "Order status updated successfully",
      updatedOrder,
    );
  } catch (error) {
    next(error);
  }
};
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status !== "PENDING") {
      throw new ApiError(400, "Order cannot be cancelled");
    }

    const cancelledOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return handleResponse(
      res,
      200,
      "Order cancelled successfully",
      cancelledOrder,
    );
  } catch (error) {
    next(error);
  }
};
