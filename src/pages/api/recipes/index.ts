import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { Recipe } from "../../models/Recipe";
import { Tag } from "../../models/Tag";
import { Recipe as RecipeType, Tag as TagType } from "../../../global/types";
import { Favorite } from "../../models/Favorite";
import { RecipeHasCategories } from "../../models/RecipeHasCategories";

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

export async function getFeaturedRecipes(): Promise<RecipeType[]> {
  try {
    await dbConnect();

    const recipes: RecipeType[] = await Recipe.aggregate([
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

export async function getRecipeById(
  recipeId: string
): Promise<RecipeType | null> {
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

    const recipeHasCategorie = await RecipeHasCategories.find({
      recipeId,
    }).populate("tagId");

    // add "categories" field
    recipe.categories = recipeHasCategorie.map(
      (recipeHasCategory) => recipeHasCategory.tagId
    );

    return JSON.parse(JSON.stringify(recipe)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAllRecipes(): Promise<RecipeType[]> {
  try {
    await dbConnect();

    const recipes: RecipeType[] = await Recipe.aggregate([
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

    const recipeHasCategorie = await RecipeHasCategories.find({
      recipeId,
    }).populate("tagId");

    // add "categories" field

    for await (const recipe of recipes) {
      recipe.categories = recipeHasCategorie.map(
        (recipeHasCategory) => recipeHasCategory.tagId
      );
    }

    return JSON.parse(JSON.stringify(recipes)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllCategories(): Promise<TagType[]> {
  try {
    await dbConnect();

    const tags = await Tag.find();

    return JSON.parse(JSON.stringify(tags)); // use JSON object to remove new Object class not recognized by JS
  } catch (error) {
    console.error(error);
    return [];
  }
}
