import Joi from "joi";

export const categorySchema = Joi.object({
  category_name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 3 characters",
    "string.max": "Category name must not exceed 50 characters",
    "any.required": "Category name is required",
    "string.base": "Category name must be a string",
  }),
});
export const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.positive": "ID must be a positive number",
    "any.required": "ID is required",
  }),
});
