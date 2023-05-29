import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../models/Response";
import { validate } from "../../validation/validate";
import { updateResponseSchema } from "../../validation/schemas";

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const { _id: responseId } = req.query;
console.log(req.body)
    const isValidated = validate(updateResponseSchema, req.body);

    if (!isValidated) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }

    try {
      await Response.findByIdAndUpdate(responseId, { ...req.body });

      res.status(200).json({ message: "Response updated." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Updating response failed." });
    }
  }
}
