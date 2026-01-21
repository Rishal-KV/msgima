import Joi from "joi";

export const formValidationSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must include a valid country code (e.g. +91XXXXXXXXXX)",
    }),

  profileUrl: Joi.string()
    .uri()
    .optional()
    .allow(""),

  dob: Joi.date().iso().optional(),
});
