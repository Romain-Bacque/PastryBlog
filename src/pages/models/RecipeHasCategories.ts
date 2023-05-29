import mongoose, { Document, Model, Schema } from "mongoose";
import { Recipe, Tag } from "../../global/types";

export interface IRecipeHasCategories extends Document {
  tagId: Schema.Types.ObjectId | Tag;
  recipeId: Schema.Types.ObjectId | Recipe;
}

const recipeHasCategoriesSchema = new Schema({
  tagId: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
    required: true,
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
});

export const RecipeHasCategories: Model<IRecipeHasCategories> =
  mongoose.models.RecipeHasCategories ||
  mongoose.model<IRecipeHasCategories>("RecipeHasCategories", recipeHasCategoriesSchema);
