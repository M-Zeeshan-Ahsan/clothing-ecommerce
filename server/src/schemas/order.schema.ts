import Joi from "joi";

export const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.positive": "ID must be a positive number",
    "any.required": "ID is required",
  }),
});

export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED")
    .required()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Invalid order status",
      "any.required": "Status is required",
    }),
});
