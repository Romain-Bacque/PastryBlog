import { NextApiRequest, NextApiResponse } from "next";
import csrfProtection from "../../../utils/csrfProtection";
import dbConnect from "../../../utils/databaseConnection";
import { User } from "../../models/User";
import { passwordSchema } from "../../validation/schemas";
import { validate } from "../../validation/validate";
import jwt from "jsonwebtoken";

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

      const isValidated = validate(passwordSchema, req.body);

      if (!isValidated) {
        res.status(422).json({ message: "Invalid input." });
        return;
      }

      const { id, token } = req.query;
      const { password }: { password: string } = req.body;

      await dbConnect();

      const user = await User.findById(id);
      // Check if the user exists in database thanks to its ID
      if (!user) {
        return res.status(401).json({ message: "unauthorized" });
      }

      const { SECRET } = process.env;
      const secret = SECRET + user.password; // user password is use in the secret to prevent reset link reusability

      jwt.verify(token as string, secret, (err: any) => {
        if (err) {
          return res.status(401).json({ message: "unauthorized" });
        }
      });

      const hashedPassword = await User.hashPassword(password);
      const isPasswordUpdated = await User.findByIdAndUpdate(id, {
        password: hashedPassword,
      });

      if (isPasswordUpdated) {
        res.status(200).json({ message: "Password successfully updated!" });
      } else throw new Error();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to update the password!" });
    }
  }
}
