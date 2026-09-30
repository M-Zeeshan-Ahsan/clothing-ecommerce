import prisma from "../prisma/client.js";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Find guest orders through Address.email
      const guestOrders = await tx.order.findMany({
        where: {
          userId: null,
          address: {
            email: {
              equals: normalizedEmail,
              mode: "insensitive",
            },
          },
        },

        select: {
          id: true,
        },
      });

      // Attach guest orders to newly created user
      if (guestOrders.length > 0) {
        await tx.order.updateMany({
          where: {
            id: {
              in: guestOrders.map((order) => order.id),
            },
            userId: null,
          },

          data: {
            userId: user.id,
          },
        });
      }

      return user;
    });

    return handleResponse(res, 201, "User added successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();
    return handleResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return handleResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteMultipleUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = req.body;
    const userIds = ids.map((id: string) => Number(id));
    const result = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    if (result.length !== userIds.length) {
      throw new ApiError(404, "One or more users not found");
    }
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    return handleResponse(res, 200, "Users deleted successfully", result);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const specificUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return handleResponse(res, 200, "Profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 10, 1);

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const role = typeof req.query.role === "string" ? req.query.role : "";

    const skip = (page - 1) * limit;

    // =========================
    // WHERE
    // =========================

    const where: {
      role?: "USER" | "ADMIN";
      OR?: Array<{
        name?: {
          contains: string;
          mode: "insensitive";
        };
        email?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
    } = {};

    // =========================
    // ROLE FILTER
    // =========================

    if (role === "USER" || role === "ADMIN") {
      where.role = role;
    }

    // =========================
    // SEARCH
    // =========================

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // =========================
    // USERS + TOTAL
    // =========================

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,

          _count: {
            select: {
              orders: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limit,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return handleResponse(res, 200, "All users fetched successfully", {
      users,
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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return handleResponse(
      res,
      200,
      "User role updated successfully",
      updatedUser,
    );
  } catch (error) {
    next(error);
  }
};

export const createAdminUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return handleResponse(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.id);

    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    if (email !== existingUser.email) {
      const emailUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailUser && emailUser.id !== userId) {
        throw new ApiError(400, "User with this email already exists");
      }
    }

    let hashedPassword: string | undefined;

    if (password?.trim()) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name,
        email,
        role,

        ...(hashedPassword && {
          password: hashedPassword,
        }),
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        orders: {
          select: {
            id: true,
          },
        },

        cart: {
          select: {
            id: true,
          },
        },

        addresses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.orders.length > 0) {
      throw new ApiError(
        400,
        "User cannot be deleted because they have existing orders",
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete cart items first
      if (user.cart) {
        await tx.cartItem.deleteMany({
          where: {
            cartId: user.cart.id,
          },
        });

        await tx.cart.delete({
          where: {
            id: user.cart.id,
          },
        });
      }

      // Delete addresses
      await tx.address.deleteMany({
        where: {
          userId,
        },
      });

      // Finally delete user
      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return handleResponse(res, 200, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
