import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
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
  if (req.method === "POST") {
    const [commentId] = req.query.slug!;
    const { text } = req.body;

    if (!text.trim()) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }

    const newResponse = {
      date: new Date(),
      text,
      commentId,
    };

    try {
      const response = await Response.create(newResponse);

      const formattedDate = response.date.toLocaleDateString("fr", {
        day: "numeric",
        month: "long", // 1 => "January"
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });

      const responseData = {
        _id: response._id,
        text: response.text,
        date: formattedDate,
        commentId: response.commentId,
      };

      res
        .status(201)
        .json({ message: "Response added.", response: responseData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Adding responses failed." });
    }
  } else if (req.method === "DELETE") {
    const [responseId, pastryId] = req.query.slug!;

    try {
      await Response.findByIdAndDelete(responseId);

      const comments = await Comment.aggregate([
        { $match: { pastryId: new mongoose.Types.ObjectId(pastryId) } },
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
      ]);

      res.status(200).json({ message: "Response deleted.", comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Deleting comment failed." });
    }
  }
}
