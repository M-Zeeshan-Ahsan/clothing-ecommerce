import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import {
  getAllOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
} from "../controller/order.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../controller/user.controller.js";
import {
  userRoleSchema,
  userIdSchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/user.schema.js";
import { getAllProductsAdmin } from "../controller/product.controller.js";
import { getDashboardStats } from "../controller/dashboard.controller.js";
import { orderStatusSchema, idSchema } from "../schemas/order.schema.js";

const router = Router();
router.get("/orders", verifyToken, verifyAdmin, getAllOrders);
router.get("/orders/:id", verifyToken, verifyAdmin, getAdminOrderById);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.post(
  "/users",
  verifyToken,
  verifyAdmin,
  validate(createUserSchema),
  createAdminUser,
);

router.put(
  "/users/:id",
  verifyToken,
  verifyAdmin,
  validate(userIdSchema, "params"),
  validate(updateUserSchema),
  updateAdminUser,
);

router.get("/users/:id", verifyToken, verifyAdmin, getUserById);
router.put(
  "/orders/:id/status",
  verifyToken,
  verifyAdmin,
  validate(idSchema, "params"),
  validate(orderStatusSchema),
  updateAdminOrderStatus,
);
router.put(
  "/users/:id/role",
  verifyToken,
  verifyAdmin,
  validate(userIdSchema, "params"),
  validate(userRoleSchema),
  updateUserRole,
);
router.delete(
  "/users/:id",
  verifyToken,
  verifyAdmin,
  validate(userIdSchema, "params"),
  deleteAdminUser,
);
router.get("/products", verifyToken, verifyAdmin, getAllProductsAdmin);
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
export default router;
