import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controller/order.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import { orderStatusSchema, idSchema } from "../schemas/order.schema.js";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, validate(idSchema), getOrderById);
router.put(
  "/:id",
  verifyToken,
  validate(idSchema, "params"),
  validate(orderStatusSchema),
  updateOrderStatus,
);
router.put(
  "/:id/cancel",
  verifyToken,
  validate(idSchema, "params"),
  cancelOrder,
);
export default router;
