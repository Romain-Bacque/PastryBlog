import mongoose, { Document, Model, Schema } from "mongoose";

interface IRecipeHasCategories extends Document {
  tagId: string;
  recipeId: string;
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
