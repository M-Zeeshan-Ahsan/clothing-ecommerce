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
export const checkoutOrderSchema = Joi.object({
  address: Joi.object({
    fullName: Joi.string().trim().required().messages({
      "any.required": "Full name is required",
      "string.empty": "Full name is required",
    }),

    phone: Joi.string().trim().required().messages({
      "any.required": "Phone number is required",
      "string.empty": "Phone number is required",
    }),

    address: Joi.string().trim().required().messages({
      "any.required": "Complete address is required",
      "string.empty": "Complete address is required",
    }),

    city: Joi.string().trim().required().messages({
      "any.required": "City is required",
      "string.empty": "City is required",
    }),

    postalCode: Joi.string().trim().allow("").optional(),
  })
    .required()
    .messages({
      "any.required": "Shipping address is required",
    }),

  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required()
    .messages({
      "any.required": "Cart items are required",
      "array.min": "Cart is empty",
    }),

  paymentMethod: Joi.string().valid("COD").required().messages({
    "any.only": "Only Cash on Delivery is available",
    "any.required": "Payment method is required",
  }),
  email: Joi.string().email().allow("").optional().messages({
    "string.email": "Please enter a valid email address",
  }),
});
