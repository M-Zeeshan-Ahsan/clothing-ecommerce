import Joi from "joi";

export const addressSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must not exceed 100 characters",
    "any.required": "Full name is required",
  }),

  phone: Joi.string().trim().min(10).max(15).required().messages({
    "string.empty": "Phone is required",
    "string.min": "Phone must be at least 10 characters",
    "string.max": "Phone must not exceed 15 characters",
    "any.required": "Phone is required",
  }),

  address: Joi.string().trim().min(5).max(255).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address must not exceed 255 characters",
    "any.required": "Address is required",
  }),

  city: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters",
    "string.max": "City must not exceed 50 characters",
    "any.required": "City is required",
  }),

  postalCode: Joi.string().trim().max(20).allow("").optional(),
});
export const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.positive": "ID must be a positive number",
    "any.required": "ID is required",
  }),
});
