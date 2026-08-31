import { Router } from "express";
import {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getSpecificCategory,
} from "../controller/category.controller.js";
import validate from "../middleware/validate.js";
import { categorySchema, idSchema } from "../schemas/category.schema.js";

const router = Router();

router.post("/", validate(categorySchema), createCategory);
router.get("/", getCategory);
router.delete("/:id", validate(idSchema, "params"), deleteCategory);
router.put(
  "/:id",
  validate(idSchema, "params"),
  validate(categorySchema),
  updateCategory,
);
router.get("/:id", validate(idSchema, "params"), getSpecificCategory);
export default router;
