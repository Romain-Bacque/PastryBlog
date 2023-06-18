import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/databaseConnection";
import { Recipe } from "../../models/Recipe";
import { Tag } from "../../models/Tag";
import { Recipe as RecipeType, Tag as TagType } from "../../../global/types";
import { RecipeHasCategories } from "../../models/RecipeHasCategories";
import * as cheerio from "cheerio"; // Importing the Cheerio module
import { v2 as cloudinary } from "cloudinary";

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// export async function getFeaturedRecipes(): Promise<RecipeType[]> {
//   try {
//     await dbConnect();

//     const recipeHasCategories = await RecipeHasCategories.aggregate([
//       {
//         $lookup: {
//           from: "tags", // The name of the collection you want to join with
//           localField: "tagId",
//           foreignField: "_id",
//           as: "tags",
//         },
//       },
//       {
//         $lookup: {
//           from: "recipes", // The name of the collection you want to join with
//           localField: "recipeId",
//           foreignField: "_id",
//           as: "recipe",
//         },
//       },
//       {
//         $unwind: "$recipe", // "unwind" is used to flatten the array generated thanks to "lookup" operator
//       },
//       {
//         $match: {
//           "recipe.isFeatured": true,
//         },
//       },
//       {
//         $replaceRoot: {
//           newRoot: "$recipe", // "replaceRoot" stage in the aggregation pipeline is used to replace the current root document with a new document. It allows you to promote a specified subdocument or field to become the new root of the resulting documents.
//         },
//       },
//       {
//         $project: {
//           "_id": 1,
//           "title": 1,
//           "image": 1,
//           "description": 1,
//           "content": 1,
//           "isFeatured": 1,
//           "date": {
//             $dateToString: {
//               format: "%d-%m-%Y %H:%M:%S",
//               date: "$date",
//               timezone: "Europe/Paris",
//             },
//           },
//           "categories": "$tags",
//         },
//       },
//     ]);

//     return JSON.parse(JSON.stringify(recipeHasCategories)); // use JSON object to remove new Object class not recognized by JS
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

if (process.env.NODE_ENV !== "development") {
  console.log = function () {};
  console.error = function () {};
  console.trace = function () {};
}

async function formatRecipe(recipe: RecipeType): Promise<RecipeType> {
  const recipeHasCategories = await RecipeHasCategories.find({
    recipeId: recipe._id,
  }).populate("tagId");

  const categories = recipeHasCategories.map(
    (recipeHasCategory) => recipeHasCategory.tagId
  );

  return {
    ...recipe,
    categories: categories as TagType[],
  };
}

export async function getFeaturedRecipes(): Promise<RecipeType[]> {
  try {
    await dbConnect();

    const recipes = await Recipe.aggregate([
      {
        $match: { isFeatured: true },
      },
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
    ]);

    const formattedRecipes = await Promise.all(recipes.map(formatRecipe)); // Promise.all takes an array of promises and returns a new promise that resolves when all the input promises have resolved, or rejects if any of them reject.

    return JSON.parse(JSON.stringify(formattedRecipes)); // use JSON object to remove new Object class not recognized by JS
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

    const formattedRecipes = await formatRecipe(recipe);

    return JSON.parse(JSON.stringify(formattedRecipes)); // use JSON object to remove new Object class not recognized by JS
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

    const formattedRecipes = await Promise.all(recipes.map(formatRecipe)); // Promise.all takes an array of promises and returns a new promise that resolves when all the input promises have resolved, or rejects if any of them reject.

    return JSON.parse(JSON.stringify(formattedRecipes)); // use JSON object to remove new Object class not recognized by JS
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CSP here
  // const cspHeader =
  //   "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' https://cloudinary.com/; upgrade-insecure-requests; frame-ancestors 'self';";

  // res.setHeader("Content-Security-Policy-Report-Only", cspHeader); // 'Content-Security-Policy' in prod env

  if (req.method === "GET") {
    try {
      await dbConnect();

      const { search } = req.query;

      const recipes = await Recipe.find({
        title: { $regex: search, $options: "i" },
      }).select({ _id: 1, title: 1 });

      res.status(200).json(recipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to find a favorite!" });
    }
  } else if (req.method === "POST") {
    try {
      await dbConnect();
      const { date, title, description, content } = req.body;
      const $ = cheerio.load(content);

      const base64ImgList: string[] = [];

      $("img").each((_, image) => {
        base64ImgList.push(image.attribs.src);
      });

      let multiplePicturePromise = base64ImgList.map((image) =>
        cloudinary.uploader.upload(image, { folder: "PastryBlog" })
      );

      // execute all promises
      Promise.all(multiplePicturePromise)
        .then((results) => {
          // Récupération des informations sur les images uploadées
          results.forEach(async (result) => {
            console.log("Image uploaded:", await result.url);
          });
        })
        .catch((error) => {
          console.error("Error uploading images:", error);
        });
        $("img").each((index, image) => {
          image
        });
      // res.status(200).json(recipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Impossible to add a recipe!" });
    }
  }
}
