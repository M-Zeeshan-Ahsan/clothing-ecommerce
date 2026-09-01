import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have at most 100 characters",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have at most 100 characters",
    "any.required": "Password is required",
  }),
});

export const userIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
  }),
});
