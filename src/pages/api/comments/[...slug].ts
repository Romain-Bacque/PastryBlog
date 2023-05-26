import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { Comment } from "../../models/Comment";
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
  if (req.method === "GET") {
    const [pastryId, pageNumber] = req.query.slug!;

    const limit = 10,
      offset = limit * +pageNumber;

    try {
      await dbConnect();

      const comments = await Comment.aggregate([
        { $match: { pastryId: new mongoose.Types.ObjectId(pastryId) } },
        {
          $project: {
            _id: 1,
            name: 1,
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
            pipeline: [
              {
                $project: {
                  _id: 1,
                  text: 1,
                  commentId: 1,
                  date: {
                    $dateToString: {
                      format: "%d-%m-%Y %H:%M:%S",
                      date: "$date",
                      timezone: "Europe/Paris",
                    },
                  },
                },
              },
            ],
          },
        },
        { $skip: offset - limit },
        { $limit: limit },
      ]);

      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Getting comments failed." });
    }
  } else if (req.method === "DELETE") {
    const [commentId, pastryId] = req.query.slug!;

    try {
      await dbConnect();

      await Comment.findByIdAndDelete(commentId);
      await Response.deleteMany({ commentId });

      const comments = await Comment.aggregate([
        { $match: { pastryId: new mongoose.Types.ObjectId(pastryId) } },
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
            from: "Response",
            localField: "_id",
            foreignField: "commentId",
            as: "responses",
          },
        },
        { $addFields: { responses: "$responses" } },
      ]);

      res.status(200).json({ message: "Comment deleted.", comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Deleting comment failed." });
    }
  }
}
