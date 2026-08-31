import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validate = (
  schema: Joi.ObjectSchema,
  source: "body" | "params" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0]?.message?.replace(/"/g, "") || "Validation error",
      });
    }

    next();
  };
};

export default validate;
