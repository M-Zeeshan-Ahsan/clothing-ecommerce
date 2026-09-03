import { Router } from "express";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  cartSummary,
} from "../controller/cart.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import {
  addToCartSchema,
  updateCartQuantitySchema,
  productIdSchema,
} from "../schemas/cart.schema.js";

const router = Router();
router.post("/", verifyToken, validate(addToCartSchema), addToCart);
router.get("/", verifyToken, getCartItems);
router.patch(
  "/quantity/:productId",
  verifyToken,
  validate(updateCartQuantitySchema, "params"),
  updateCartQuantity,
);
router.delete(
  "/:productId",
  verifyToken,
  validate(productIdSchema, "params"),
  removeFromCart,
);
router.delete("/", verifyToken, clearCart);
router.get("/total", verifyToken, cartSummary);
export default router;
