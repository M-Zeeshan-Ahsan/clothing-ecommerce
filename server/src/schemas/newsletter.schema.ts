import Joi from "joi";

export const newsletterSubscribeSchema = Joi.object({
  email: Joi.string().trim().email().required(),
});
