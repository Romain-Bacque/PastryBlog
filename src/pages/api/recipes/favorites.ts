import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { validate } from "../../validation/validate";
import { favoriteSchema } from "../../validation/schemas";
import { Favorite } from "../../models/Favorite";
import mongoose from "mongoose";
import { Recipe } from "../../../global/types";

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

export async function getUserFavoritesRecipes(
  userId: string
): Promise<Recipe | null> {
  try {
    await dbConnect();

    const favorites = await Favorite.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "recipes",
          localField: "recipeId",
          foreignField: "_id",
          as: "recipe",
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                image: 1,
                description: 1,
                content: 1,
                isFeatured: 1,
                tagId: 1,
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

    const favoritesDetailed = favorites.map((favorite) => favorite.recipe[0]);

    return JSON.parse(JSON.stringify(favoritesDetailed)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      await dbConnect();

      const { userId } = req.query;

      const favorites = await Favorite.find({ userId });
      const recipeIds = favorites.map((favorite) => favorite.recipeId);

      res.status(200).json({ favorites: recipeIds });
    } catch (error) {
      res.status(500).json({ message: "Impossible to get user favorites!" });
    }
  } else if (req.method === "POST") {
    const isValidated = validate(favoriteSchema, req.body);

    if (!isValidated) {
      res.status(422).json({ message: "Invalid input." });
      return;
    }

    try {
      await dbConnect();

      if (await Favorite.findOne({ ...req.body })) {
        res.status(409).json({ message: "Favorite already exists!" });
        return;
      }

      await Favorite.create({
        ...req.body,
      });

      res.status(200).json({ message: "Favorite added!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to add a favorite!" });
    }
  } else if (req.method === "DELETE") {
    try {
      await dbConnect();

      const { userId, recipeId } = req.query;

      const favorite = await Favorite.findOneAndDelete({ userId, recipeId });

      if (favorite) {
        res.status(200).json({ message: "Favorite deleted!" });
      } else res.status(404).json({ message: "Favorite not found!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to delete a favorite!" });
    }
  }
}
