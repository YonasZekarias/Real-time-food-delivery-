const Joi = require("joi");

const createOrderSchema = Joi.object({
  deliveryLocation: Joi.object({
    type: Joi.string().valid("Point").required().messages({
      "string.valid": "Location type must be Point",
      "any.required": "Location type is required",
    }),
    coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
      "array.length": "Coordinates must be [longitude, latitude]",
      "array.base": "Coordinates must be an array",
      "any.required": "Coordinates are required",
    }),
  })
    .required()
    .messages({
      "any.required": "Delivery location is required",
    }),
  paymentMethod: Joi.string()
    .valid("cash", "mobile_banking", "card")
    .required()
    .messages({
      "string.valid": "Invalid payment method",
      "any.required": "Payment method is required",
    }),
});

const feedbackSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({

    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must not exceed 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().optional().allow(null).max(500).messages({
    "string.base": "Comment must be a string",
    "string.max": "Comment must not exceed 500 characters",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = {
  validateCreateOrder: validate(createOrderSchema),
  validateFeedback: validate(feedbackSchema),
};
