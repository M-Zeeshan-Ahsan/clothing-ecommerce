import { Router } from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  getSpecificProduct,
  updateProduct,
  deleteMultipleProducts,
} from "../controller/product.controller.js";
import validate from "../middleware/validate.js";
import {
  productSchema,
  idSchema,
  multipleIdsSchema,
} from "../schemas/product.schema.js";

const router = Router();

router.post("/", validate(productSchema), createProduct);
router.get("/", getProducts);
router.delete("/:id", validate(idSchema, "params"), deleteProduct);
router.put(
  "/:id",
  validate(idSchema, "params"),
  validate(productSchema),
  updateProduct,
);
router.get("/:id", validate(idSchema, "params"), getSpecificProduct);
router.delete("/", validate(multipleIdsSchema, "body"), deleteMultipleProducts);
export default router;
