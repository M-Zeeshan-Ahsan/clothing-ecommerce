import Joi from "joi";

export const categorySchema = Joi.object({
  category_name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 3 characters",
    "string.max": "Category name must not exceed 50 characters",
    "any.required": "Category name is required",
    "string.base": "Category name must be a string",
  }),
  category_image: Joi.string().trim().uri().required().messages({
    "string.empty": "Category image is required",
    "string.uri": "Category image must be a valid URL",
    "any.required": "Category image is required",
    "string.base": "Category image must be a string",
  }),
  category_slogan: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Category slogan is required",
    "string.min": "Category slogan must be at least 3 characters",
    "string.max": "Category slogan must not exceed 100 characters",
    "any.required": "Category slogan is required",
    "string.base": "Category slogan must be a string",
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
