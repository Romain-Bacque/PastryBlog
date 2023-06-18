import * as baseJoi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = baseJoi.extend(joiPasswordExtendCore);
const sanitizeHtml = require("sanitize-html");

// Sanitizing
const extension = (joi) => ({
  type: "string",
  base: joi.string(), // extension is defined on joi.string()
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        // Joi will automatically call this method for whatever value it will receive
        const clean = sanitizeHtml(value, {
          allowedTags: [], // no tag are allowed
          allowedAttributes: {}, // no attribute are allowed
        });
        if (clean !== value) return helpers.error("string.escapeHTML");
        return clean;
      },
    },
  },
});

const joi = baseJoi.extend(extension);

// Schemas

/**
 * registerSchema monitor the register request body, and return an error if any of requirements doesn't match with it
 */
export const registerSchema = joi
  .object({
    username: joi.string().required(),
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * loginSchema monitor the login request body, and return an error if any of requirements doesn't match with it
 */
export const loginSchema = joi
  .object({
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * editProfileSchema monitor the edit profile request body, and return an error if any of requirements doesn't match with it
 */
export const editProfileSchema = joi
  .object({
    name: joi.string().required(),
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    actualPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
    newPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * addCommentSchema monitor the post comment request body, and return an error if any of requirements doesn't match with it
 */
export const addCommentSchema = joi
  .object({
    name: joi.string().escapeHTML().required(),
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } }),
    date: joi.date(),
    text: joi.string().escapeHTML().required(),
    pastryId: joi.string().escapeHTML().required(),
  })
  .required();

/**
 * addResponseSchema monitor the post response request body, and return an error if any of requirements doesn't match with it
 */
export const addResponseSchema = joi
  .object({
    date: joi.date(),
    text: joi.string().escapeHTML().required(),
  })
  .required();

/**
 * updateResponseSchema monitor the update response request body, and return an error if any of requirements doesn't match with it
 */
export const updateResponseSchema = joi
  .object({
    date: joi.date(),
    text: joi.string().escapeHTML().required(),
  })
  .required();

/**
 * emailSchema monitor the forget password request body, and return an error if any of requirements doesn't match with it
 */
export const emailSchema = joi
  .object({
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } }),
  })
  .required();

/**
 * passwordSchema monitor the reset password request body, and return an error if any of requirements doesn't match with it
 */
export const passwordSchema = joi
  .object({
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * favoriteSchema monitor the post favorite request body, and return an error if any of requirements doesn't match with it
 */
export const favoriteSchema = joi
  .object({
    userId: joi.string().escapeHTML().required(),
    recipeId: joi.string().escapeHTML().required(),
  })
  .required();

/**
 * postRecipeSchema monitor the post recipe request body, and return an error if any of requirements doesn't match with it
 */
export const postRecipeSchema = joi
  .object({
    date: joi.date().required(),
    title: joi.string().escapeHTML().required(),
    image: joi.binary(),
    description: joi.string().escapeHTML().required(),
    content: joi.string().required(),
  })
  .required();
