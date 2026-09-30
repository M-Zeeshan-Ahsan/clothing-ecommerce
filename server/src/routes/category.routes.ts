import { Router } from "express";

import {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getSpecificCategory,
} from "../controller/category.controller.js";

import validate from "../middleware/validate.js";
import verifyToken from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

import { categorySchema, idSchema } from "../schemas/category.schema.js";

const router = Router();

// Public
router.get("/", getCategory);

router.get("/:id", validate(idSchema, "params"), getSpecificCategory);

// Admin only
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  validate(categorySchema),
  createCategory,
);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  validate(idSchema, "params"),
  deleteCategory,
);

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  validate(idSchema, "params"),
  validate(categorySchema),
  updateCategory,
);

export default router;
