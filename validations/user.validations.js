const Joi = require("joi");

const createUserValidation = (data) => {
    const validateUserSchema = Joi.object({
        username: Joi.string().min(3).required().messages({
          "string.empty": `"username" cannot be empty`,
          "string.min": `"username" should have a minimum length of {#limit}`,
          "any.required": `"username" field is required`,
        }),
    
        email: Joi.string().email().required().messages({
          "string.empty": `"email" cannot be empty`,
          "string.email": `"email" must be a valid email`,
          "any.required": `"email" field is required`,
        }),
    
        phone: Joi.string().required().messages({
          "string.empty": `"phone" cannot be empty`,
          "any.required": `"phone" field is required`,
        }),
        password: Joi.string().min(8).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required().messages({
          "string.empty": `"password" cannot be empty`,
          "string.min": `"password" should have a minimum length of {#limit}`,
          "string.pattern.base": `"password" should include at least one uppercase letter, one lowercase letter, one number, and one special character`,
          "any.required": `"password" field is required`,
        }), 
        password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({
          "any.only": `"password confirmation" does not match "password"`,
          "any.required": `"password confirmation" field is required`,
        })
      });
      const {error} = validateUserSchema.validate(data);
      return error
}

const validateVerificationData = (data) => {
  const validateVerificationDataSchema =  Joi.object({
    email: Joi.string().email().required(),
otp: Joi.string().required()
  })
  const {error} = validateVerificationDataSchema.validate(data)
  return error

}

const updateUserValidation = (data) => {
    const validateUserUpdateSchema = Joi.object({
        username: Joi.string().min(3).messages({
          "string.empty": `"username" cannot be empty`,
          "string.min": `"username" should have a minimum length of {#limit}`,
        }),
  
        email: Joi.string().email().required().messages({
          "string.empty": `"email" cannot be empty`,
          "string.email": `"email" must be a valid email`
        }),
  
        phone: Joi.string().messages({
          "string.empty": `"phone" cannot be empty`,
        }),
      }).or("username", "email", "phone");
      const { error} = validateUserUpdateSchema.validate(data);
     return error
    } 

const EmailAndPasswordValidation = (data) => {
  const EmailAndPasswordValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
const {error} = EmailAndPasswordValidationSchema.validate(data)
return error
}
module.exports = {createUserValidation, validateVerificationData, updateUserValidation, EmailAndPasswordValidation}

    