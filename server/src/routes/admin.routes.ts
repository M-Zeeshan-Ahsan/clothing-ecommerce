import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import { getAllOrders } from "../controller/order.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../controller/user.controller.js";
import { userRoleSchema, userIdSchema } from "../schemas/user.schema.js";
import { getAllProductsAdmin } from "../controller/product.controller.js";
import { getDashboardStats } from "../controller/dashboard.controller.js";

const router = Router();
router.get("/orders", verifyToken, verifyAdmin, getAllOrders);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.get("/users/:id", verifyToken, verifyAdmin, getUserById);
router.put(
  "/users/:id/role",
  verifyToken,
  verifyAdmin,
  validate(userIdSchema, "params"),
  validate(userRoleSchema),
  updateUserRole,
);
router.get("/products", verifyToken, verifyAdmin, getAllProductsAdmin);
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
export default router;
