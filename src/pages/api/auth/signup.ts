import { NextApiRequest, NextApiResponse } from "next";
import csrfProtection from "../../../utils/csrfProtection";
import dbConnect from "../../../utils/databaseConnection";
import { User } from "../../models/User";
import { registerSchema } from "../../validation/schemas";
import { validate } from "../../validation/validate";

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await csrfProtection(req, res);

      const isValidated = validate(registerSchema, req.body);

      if (!isValidated) {
        res.status(422).json({ message: "Invalid input." });
        return;
      }

      const { username, email, password } = req.body;

      await dbConnect();

      const userExist = await User.findOne({
        username,
        email,
      });

      if (userExist) {
        res.status(409).json({ message: "User already exists!" });
        return;
      }

      const user = new User({ username, password, email });

      await user.save();

      res.status(201).json({ message: "Created user!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to create a new user!" });
    }
  }
}
