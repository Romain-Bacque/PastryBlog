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
 * postBrewerySchema monitor the brewery request body, and return an error if any of requirements doesn't match with it
 */
export const postShelterImage = joi
  .object({
    title: joi.string().escapeHTML().required(),
    image: joi.binary(),
    description: joi.string().escapeHTML().required(),
    address: joi.string().escapeHTML().required(),
    lat: joi.number().required(),
    lon: joi.number().required(),
    categories: joi.array().items(joi.number().min(1).required()),
  })
  .required();

/**
 * editBrewerySchema monitor the brewery request body, and return an error if any of requirements doesn't match with it
 */
export const editBrewerySchema = joi
  .object({
    title: joi.string().escapeHTML().required(),
    image: joi.binary(),
    description: joi.string().escapeHTML().required(),
    address: joi.string().escapeHTML().required(),
    lat: joi.number().required(),
    lon: joi.number().required(),
    categories: joi.array().items(joi.number().min(1).required()),
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
 * postBookingSchema monitor the post booking request body, and return an error if any of requirements doesn't match with it
 */
export const postBookingSchema = joi
  .object({
    shelterId: joi.string().escapeHTML().required(),
    name: joi.string().escapeHTML().required(),
    numberOfPerson: joi.number().min(1).max(4).required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    from: joi.date(),
    to: joi.date(),
    informations: joi.string().escapeHTML(),
    categories: joi.array().items(joi.number().min(1).required()),
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
