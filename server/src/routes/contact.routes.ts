import { Router } from "express";

import { createContactMessage } from "../controller/contact.controller.js";
import validate from "../middleware/validate.js";
import { contactSchema } from "../schemas/contact.schema.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", validate(contactSchema), createContactMessage);
// Admin

export default router;
