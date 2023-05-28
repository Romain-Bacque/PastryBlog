import mongoose, { Document, Model, Schema } from "mongoose";

interface IFavorite extends Document {
  userId: string;
  recipeId: string;
}

const favoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
});

export const Favorite: Model<IFavorite> =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", favoriteSchema);
