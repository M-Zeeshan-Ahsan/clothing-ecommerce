import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const userId = req.user!.id;

    // 1. Check product exists
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // 2. Find user's cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
    });

    // 3. If cart doesn't exist, create it
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    // 4. Check product already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId),
        },
      },
    });

    // 5. If already exists, increase quantity
    if (existingCartItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });

      return handleResponse(
        res,
        200,
        "Product quantity updated in cart",
        updatedCartItem,
      );
    }

    // 6. If product doesn't exist in cart, create CartItem
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: quantity,
      },
    });

    return handleResponse(
      res,
      201,
      "Product added to cart successfully",
      cartItem,
    );
  } catch (error) {
    next(error);
  }
};
export const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
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

    return handleResponse(res, 200, "Cart items fetched successfully", cart);
  } catch (error) {
    next(error);
  }
};
export const updateCartQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    // Product ID check
    if (isNaN(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    // User ka cart find karo
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Cart mein product find karo
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new ApiError(404, "Product not found in cart");
    }

    // Quantity update
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
    });

    return handleResponse(
      res,
      200,
      "Cart quantity updated successfully",
      updatedCartItem,
    );
  } catch (error) {
    next(error);
  }
};
export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    // User ka cart find karo
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Cart ke andar product find karo
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new ApiError(404, "Product not found in cart");
    }

    // Cart item delete karo
    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return handleResponse(
      res,
      200,
      "Product removed from cart successfully",
      null,
    );
  } catch (error) {
    next(error);
  }
};
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;

    // User ka cart find karo
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Cart ke saare items delete karo
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return handleResponse(res, 200, "Cart cleared successfully", null);
  } catch (error) {
    next(error);
  }
};
export const cartSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userId = req.user.id;

    // User ka cart find karo
    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
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

    // Total different products
    const totalProducts = cart.items.length;

    // Total quantity
    const totalQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    // Total price
    const totalPrice = cart.items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);

    return handleResponse(res, 200, "Cart summary fetched successfully", {
      cartId: cart.id,
      totalProducts,
      totalQuantity,
      totalPrice,
      items: cart.items,
    });
  } catch (error) {
    next(error);
  }
};
