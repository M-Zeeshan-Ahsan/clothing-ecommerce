import Joi from "joi";
export const addToCartSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.integer": "Product ID must be an integer",
    "number.positive": "Product ID must be a positive number",
    "any.required": "Product ID is required",
  }),

  quantity: Joi.number().integer().positive().default(1).messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.positive": "Quantity must be greater than 0",
  }),
});
export const updateCartQuantitySchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.integer": "Product ID must be an integer",
    "number.positive": "Product ID must be a positive number",
    "any.required": "Product ID is required",
  }),
  //   quantity: Joi.number().integer().positive().required().messages({
  //     "number.base": "Quantity must be a number",
  //     "number.integer": "Quantity must be an integer",
  //     "number.positive": "Quantity must be a positive number",
  //     "any.required": "Quantity is required",
  //   }),
});
export const productIdSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.integer": "Product ID must be an integer",
    "number.positive": "Product ID must be a positive number",
    "any.required": "Product ID is required",
  }),
});
