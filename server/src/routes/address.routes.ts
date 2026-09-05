import { Router } from "express";

import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controller/address.controller.js";

import verifyToken from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";

import { addressSchema, idSchema } from "../schemas/address.schema.js";

const router = Router();

router.post("/", verifyToken, validate(addressSchema), createAddress);

router.get("/", verifyToken, getAddresses);

router.get("/:id", verifyToken, validate(idSchema, "params"), getAddressById);

router.put(
  "/:id",
  verifyToken,
  validate(idSchema, "params"),
  validate(addressSchema),
  updateAddress,
);

router.delete("/:id", verifyToken, validate(idSchema, "params"), deleteAddress);

export default router;
