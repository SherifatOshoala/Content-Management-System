const Joi = require("joi");

const createCategoryValidation = (data) => {
    const validateCategorySchema = Joi.object({
        name: Joi.string().min(5).max(25).required().messages({
          "string.empty": `"name" cannot be empty!`,
          "string.min": `"name" requires a min length of {#limit}!`,
          "string.max": `"name" length cannot be more than {#limit}`,
          "any.required": `"name" field is required!`,
        }),
        description: Joi.string().min(10).max(75).required().messages({
          "string.empty": `"description" cannot be empty!`,
          "string.min": `"description" requires a min length of {#limit}!`,
          "string.max": `"description" length cannot be more than {#limit}`,
          "any.required": `"description" cannot be empty!`,
        }),
      });
      const { error} = validateCategorySchema.validate(data);
  return error
}

const updateCategoryValidation = (data) => {
    const validateCategorySchema = Joi.object({
        name: Joi.string().min(5).max(25).messages({
          "string.empty": `"name" cannot be empty!`,
          "string.min": `"name" requires a min length of {#limit}!`,
          "string.max": `"name" length cannot be more than {#limit}`,
        }),
        description: Joi.string().min(10).max(75).messages({
          "string.empty": `"description" cannot be empty!`,
          "string.min": `"description" requires a min length of {#limit}!`,
          "string.max": `"description" length cannot be more than {#limit}`,
        }),
      })
        .or("name", "description")
        .messages({
          "object.missing": `"name" or "description" must be provided!`,
        });
      const {error} = validateCategorySchema.validate(data);
      return error
}
module.exports = {createCategoryValidation, updateCategoryValidation}