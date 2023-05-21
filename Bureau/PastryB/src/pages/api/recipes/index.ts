import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { Recipe } from "../../models/Recipe";
import { Tag } from "../../models/Tag";

// interfaces
interface Recipe {
  _id: string;
  image?: string;
  title: string;
  date: string;
  description: string;
  content: string;
}
interface Tag {
  _id: string;
  tag: string;
}

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  try {
    await dbConnect();

    const recipes: Recipe[] = await Recipe.aggregate([
      { $match: { isFeatured: true } },
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
    ]);

    return JSON.parse(JSON.stringify(recipes)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRecipeById(recipeId: string): Promise<Recipe | null> {
  try {
    await dbConnect();

    const recipe = (
      await Recipe.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(recipeId) } },
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
      ])
    )[0];

    return JSON.parse(JSON.stringify(recipe)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    await dbConnect();

    const recipes: Recipe[] = await Recipe.aggregate([
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
    ]);

    return JSON.parse(JSON.stringify(recipes)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllCategories(): Promise<Tag[]> {
  try {
    await dbConnect();

    const tags = await Tag.find();

    return JSON.parse(JSON.stringify(tags)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return [];
  }
}
