import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
  }),

  email: Joi.string().trim().email().allow("").optional().messages({
    "string.email": "Please enter a valid email address",
  }),

  phone: Joi.string().trim().required().messages({
    "any.required": "Phone number is required",
    "string.empty": "Phone number is required",
  }),

  message: Joi.string().trim().min(10).required().messages({
    "any.required": "Message is required",
    "string.empty": "Message is required",
    "string.min": "Message must be at least 10 characters",
  }),
});
