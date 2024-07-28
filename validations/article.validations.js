const Joi = require("joi");

const createArticleValidation = (data)=> {validateArticleSchema = Joi.object({
    title: Joi.string().min(10).max(50).required().messages({
      "string.empty": `"title" cannot be empty!`,
      "string.min": `"title" requires a min length of {#limit}!`,
      "string.max": `"title" length cannot be more than {#limit}`,
      "any.required": `"title" field is required!`,
    }),
    description: Joi.string().min(10).max(75).required().messages({
      "string.empty": `"description" cannot be empty!`,
      "string.min": `"description" requires a min length of {#limit}!`,
      "string.max": `"description" length cannot be more than {#limit}`,
      "any.required": `"description" field is required!`,
    }),
    body: Joi.string().min(10).max(500).required().messages({
      "string.empty": `"body" cannot be empty!`,
      "string.min": `"body" requires a min length of {#limit}!`,
      "string.max": `"body" length cannot be more than {#limit}`,
      "any.required": `"body" field is required!`,
    }),
  });
  const {error} = validateArticleSchema.validate(data);
  return error
}

const updateArticleValidation = (data) => {
    const validateArticleSchema = Joi.object({
        title: Joi.string().min(10).max(50).messages({
          "string.empty": `"title" cannot be empty!`,
          "string.min": `"title" requires a min length of {#limit}!`,
          "string.max": `"title" length cannot be more than {#limit}`,
        }),
        description: Joi.string().min(10).max(75).messages({
          "string.empty": `"description" cannot be empty!`,
          "string.min": `"description" requires a min length of {#limit}!`,
          "string.max": `"description" length cannot be more than {#limit}`,
        }),
        body: Joi.string().min(10).max(500).messages({
          "string.empty": `"body" cannot be empty!`,
          "string.min": `"body" requires a min length of {#limit}!`,
          "string.max": `"body" length cannot be more than {#limit}`,
        }),
        username: Joi.string().optional(),
        name: Joi.string().optional(),
      })
        .or("title", "description", "body", "username", "name")
        .messages({
          "object.missing": `"title", "description", "body", "username", or "name" must be provided!`,
        });
      const { error} = validateArticleSchema.validate(data);
      return error 
}
module.exports = { createArticleValidation, updateArticleValidation}