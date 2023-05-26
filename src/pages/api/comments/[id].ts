import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { Comment } from "../../models/Comment";

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id: pastryId } = req.query;

    try {
      await dbConnect();

      const comments = await Comment.aggregate([
        { $match: { pastryId: new mongoose.Types.ObjectId(String(pastryId)) } },
        {
          $project: {
            _id: 1,
            email: 1,
            text: 1,
            pastryId: 1,
            date: {
              $dateToString: {
                format: "%d-%m-%Y %H:%M:%S",
                date: "$date",
                timezone: "Europe/Paris",
              },
            },
          },
        },
        {
          $lookup: {
            from: "responses",
            localField: "_id",
            foreignField: "commentId",
            as: "responses",
          },
        },
        { $addFields: { responses: "$responses" } },
      ]);

      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Getting comments failed." });
    }
  }
}
