import { Router } from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  specificUser,
  getProfile,
} from "../controller/user.controller.js";
import validate from "../middleware/validate.js";
import { userSchema, userIdSchema } from "../schemas/user.schema.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", validate(userSchema), createUser);
router.get("/", getUsers);
router.delete("/:id", validate(userIdSchema, "params"), deleteUser);
router.put(
  "/:id",
  validate(userIdSchema, "params"),
  validate(userSchema),
  updateUser,
);
router.get("/profile", verifyToken, getProfile);
router.get("/:id", validate(userIdSchema, "params"), specificUser);

export default router;
