import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";
import {
  sendOrderConfirmationEmail,
  sendNewOrderNotificationEmail,
} from "../services/email.service.js";

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
        address: true,
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

export const updateAdminOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Already completed orders cannot be changed
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      throw new ApiError(400, `Order is already ${order.status.toLowerCase()}`);
    }

    // Prevent invalid status transitions
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],

      CONFIRMED: ["SHIPPED", "CANCELLED"],

      SHIPPED: ["DELIVERED"],
    };

    const allowedStatuses = allowedTransitions[order.status] ?? [];

    if (!allowedStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Cannot change order status from ${order.status} to ${status}`,
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status,
      },
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

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const status = typeof req.query.status === "string" ? req.query.status : "";

    const skip = (page - 1) * limit;

    // =========================
    // WHERE CONDITION
    // =========================

    const where: {
      status?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
      OR?: Array<{
        id?: number;
        user?: {
          name?: {
            contains: string;
            mode: "insensitive";
          };
          email?: {
            contains: string;
            mode: "insensitive";
          };
        };
        address?: {
          fullName?: {
            contains: string;
            mode: "insensitive";
          };
          email?: {
            contains: string;
            mode: "insensitive";
          };
        };
      }>;
    } = {};

    // =========================
    // STATUS FILTER
    // =========================

    if (
      status === "PENDING" ||
      status === "CONFIRMED" ||
      status === "SHIPPED" ||
      status === "DELIVERED" ||
      status === "CANCELLED"
    ) {
      where.status = status;
    }

    // =========================
    // SEARCH
    // =========================

    if (search) {
      const searchConditions: Array<{
        id?: number;
        user?: {
          name?: {
            contains: string;
            mode: "insensitive";
          };
          email?: {
            contains: string;
            mode: "insensitive";
          };
        };
        address?: {
          fullName?: {
            contains: string;
            mode: "insensitive";
          };
          email?: {
            contains: string;
            mode: "insensitive";
          };
        };
      }> = [
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          address: {
            fullName: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          address: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];

      const orderId = Number(search);

      if (!Number.isNaN(orderId)) {
        searchConditions.push({
          id: orderId,
        });
      }

      where.OR = searchConditions;
    }

    // =========================
    // GET ORDERS + TOTAL
    // =========================

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

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
        take: limit,
      }),

      prisma.order.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return handleResponse(res, 200, "All orders fetched successfully", {
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

export const createCheckoutOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id ?? null;

    const { address, items } = req.body;

    // =========================
    // Guest Email
    // =========================

    const customerEmail =
      typeof address.email === "string"
        ? address.email.trim().toLowerCase()
        : "";

    if (!userId && !customerEmail) {
      throw new ApiError(400, "Email is required for guest checkout");
    }

    // =========================
    // Product IDs
    // =========================

    const productIds = items.map((item: { productId: number }) =>
      Number(item.productId),
    );

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new ApiError(400, "One or more products are no longer available");
    }

    // =========================
    // Order Items
    // =========================

    let subtotal = 0;

    const orderItems: {
      productId: number;
      quantity: number;
      price: (typeof products)[number]["price"];
    }[] = items.map((item: { productId: number; quantity: number }) => {
      const product = products.find(
        (product) => product.id === Number(item.productId),
      );

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      const quantity = Number(item.quantity);

      const currentPrice =
        product.sale_price !== null
          ? Number(product.sale_price)
          : Number(product.price);

      subtotal += currentPrice * quantity;

      return {
        productId: product.id,
        quantity,
        price: product.sale_price !== null ? product.sale_price : product.price,
      };
    });

    // =========================
    // Total
    // =========================

    const shippingFee = 199;

    const totalAmount = subtotal + shippingFee;

    // =========================
    // Create Order
    // =========================

    const order = await prisma.$transaction(async (tx) => {
      // Create Address
      const newAddress = await tx.address.create({
        data: {
          userId,

          fullName: address.fullName,

          phone: address.phone,

          email: customerEmail || null,

          address: address.address,

          city: address.city,

          postalCode: address.postalCode || null,
        },
      });

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId: newAddress.id,
          totalAmount,
          status: "PENDING",
          paymentMethod: "COD",
        },
      });

      // Create Order Items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return newOrder;
    });

    // =========================
    // Customer Confirmation Email
    // =========================

    if (customerEmail) {
      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          customerName: address.fullName,
          orderId: order.id,

          items: orderItems.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId,
            );

            return {
              productName: product?.product_name || "Unknown Product",
              quantity: item.quantity,
              price: Number(item.price).toLocaleString(),
            };
          }),

          subtotal: subtotal.toLocaleString(),
          shippingFee: shippingFee.toLocaleString(),
          totalAmount: totalAmount.toLocaleString(),

          paymentMethod: "Cash on Delivery",

          address: address.address,
          city: address.city,
        });
      } catch (emailError) {
        console.error("Customer confirmation email failed:", emailError);
      }
    }

    // =========================
    // ESHANI New Order Notification
    // =========================

    try {
      await sendNewOrderNotificationEmail({
        orderId: order.id,
        customerName: address.fullName,
        customerEmail: customerEmail || "Guest",
        phone: address.phone,
        address: address.address,
        city: address.city,
        postalCode: address.postalCode,

        items: orderItems.map((item) => {
          const product = products.find(
            (product) => product.id === item.productId,
          );

          return {
            productName: product?.product_name || "Unknown Product",
            quantity: item.quantity,
            price: Number(item.price).toLocaleString(),
          };
        }),

        subtotal: subtotal.toLocaleString(),
        shippingFee: shippingFee.toLocaleString(),
        totalAmount: totalAmount.toLocaleString(),

        paymentMethod: "Cash on Delivery",
      });
    } catch (emailError) {
      console.error("New order notification email failed:", emailError);
    }

    return handleResponse(res, 201, "Order placed successfully", {
      order,
      shippingAddress: {
        ...address,
        email: customerEmail || null,
      },
      paymentMethod: "COD",
      subtotal,
      shippingFee,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const orderId = Number(id);

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        address: true,

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
