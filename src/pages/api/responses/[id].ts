import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../models/Response";

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
    const { text, date } = req.body;

    try {
      await Response.findByIdAndUpdate(responseId, { text, date });

      res.status(200).json({ message: "Response updated." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Updating response failed." });
    }
  }
}
