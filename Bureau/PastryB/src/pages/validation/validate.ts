import { ObjectSchema } from "joi";

/**
 * Function to validate the body of a request
 * @param {Joi.ObjectSchema} schema - schema to heed
 */
export const validate = (schema: ObjectSchema, reqBody: Object) => {
  const { error } = schema.validate(reqBody);

  if (error) {
    return false;
  } else return true;
};
