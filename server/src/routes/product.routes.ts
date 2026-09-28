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
import upload from "../middleware/upload.js";

import {
  productSchema,
  updateProductSchema,
  idSchema,
  multipleIdsSchema,
} from "../schemas/product.schema.js";

const router = Router();

// Create Product
router.post("/", validate(productSchema), createProduct);

// Get Products
router.get("/", getProducts);

// Delete Product
router.delete("/:id", validate(idSchema, "params"), deleteProduct);

// Update Product
router.put(
  "/:id",
  validate(idSchema, "params"),
  validate(updateProductSchema),
  updateProduct,
);

// Get Specific Product
router.get("/:id", validate(idSchema, "params"), getSpecificProduct);

// Delete Multiple Products
router.delete("/", validate(multipleIdsSchema, "body"), deleteMultipleProducts);

export default router;
