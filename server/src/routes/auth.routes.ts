import { Router } from "express";
import { userLogin } from "../controller/auth.controller.js";
import validate from "../middleware/validate.js";
import { loginSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/login", validate(loginSchema), userLogin);

export default router;
