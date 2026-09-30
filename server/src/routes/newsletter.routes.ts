import { Router } from "express";

import { subscribeNewsletter } from "../controller/newsletter.controller.js";
import validate from "../middleware/validate.js";
import { newsletterSubscribeSchema } from "../schemas/newsletter.schema.js";

const router = Router();

router.post(
  "/subscribe",
  validate(newsletterSubscribeSchema),
  subscribeNewsletter,
);

export default router;
