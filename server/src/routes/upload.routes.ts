import { Router } from "express";

import verifyToken from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import upload from "../middleware/upload.js";

import { uploadImageController } from "../controller/upload.controller.js";

const router = Router();

router.post("/image", upload.single("image"), uploadImageController);

export default router;
