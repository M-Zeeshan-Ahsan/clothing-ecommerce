import Joi from "joi";

export const productSchema = Joi.object({
  product_name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 3 characters",
    "string.max": "Product name must not exceed 50 characters",
    "any.required": "Product name is required",
    "string.base": "Product name must be a string",
  }),

  product_image: Joi.string().trim().uri().required().messages({
    "string.empty": "Product image URL is required",
    "string.uri": "Product image must be a valid URL",
    "any.required": "Product image URL is required",
    "string.base": "Product image must be a string",
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a number",
    "number.integer": "Category ID must be an integer",
    "number.positive": "Category ID must be a positive number",
    "any.required": "Category ID is required",
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
export const multipleIdsSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required()
    .messages({
      "array.base": "IDs must be an array",
      "array.min": "At least one ID is required",
      "any.required": "IDs are required",
      "number.base": "Each ID must be a number",
      "number.integer": "Each ID must be an integer",
      "number.positive": "Each ID must be a positive number",
    }),
});
