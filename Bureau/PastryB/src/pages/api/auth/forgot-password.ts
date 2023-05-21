import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import csrfProtection from "../../../utils/csrfProtection";
import dbConnect from "../../../utils/databaseConnection";
import { User } from "../../models/User";
import { emailSchema } from "../../validation/schemas";
import { validate } from "../../validation/validate";
import jwt from "jsonwebtoken";
import { emailHandler } from "../../../utils/emailHandler";

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

      const isValidated = validate(emailSchema, req.body);

      if (!isValidated) {
        res.status(422).json({ message: "Invalid input." });
        return;
      }

      await dbConnect();

      const { email } = req.body;
      const user = await User.findOne({ email });

      // Check if user exists in database thanks to its email address
      if (!user) {
        return res.status(401).json({ message: "user is not registered" });
      }

      const { SECRET } = process.env;
      const secret = SECRET + user.password; // user password is use in the secret to prevent reset link reusability
      const payload = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      const link = `${process.env.NEXT_PUBLIC_HOST_NAME}/reset-password/${user.id}/${token}`;

      emailHandler.init({
        service: "gmail",
        emailFrom: "biere.de.ta.region@gmail.com",
        subject: "Réinitialisation du mot de passe",
        template: path.join(
          process.cwd(),
          "/src/utils/emailTemplates/resetPassword.ejs"
        ),
      });

      await emailHandler.sendEmail({
        name: user.username,
        email: "bacqueromain@orange.fr",
        link,
      });

      res.status(200).json({ message: "email is successfully sent!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to send the email!" });
    }
  }
}
