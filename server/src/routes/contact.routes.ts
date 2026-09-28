import { Router } from "express";

import { createContactMessage } from "../controller/contact.controller.js";
import validate from "../middleware/validate.js";

import { contactSchema } from "../schemas/contact.schema.js";

const router = Router();

router.post("/", validate(contactSchema), createContactMessage);

export default router;
