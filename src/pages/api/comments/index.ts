import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { Comment } from "../../models/Comment";

interface Comment {
  email: string;
  date: string;
  name: string;
  text: string;
  pastryId: string;
}

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
    const { email, name, text, pastryId } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }

    try {
      await dbConnect();

      const newComment = {
        email,
        name,
        text,
        pastryId,
      };

      const comment = await Comment.create(newComment);

      const formattedDate = comment.date.toLocaleDateString("fr", {
        day: "numeric",
        month: "long", // 1 => "January"
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });

      const commentData = {
        _id: comment._id,
        name: comment.name,
        email: comment.email,
        text: comment.text,
        date: formattedDate,
        pastryId: comment.pastryId,
      };

      res.status(201).json({ message: "Comment added.", comment: commentData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}
