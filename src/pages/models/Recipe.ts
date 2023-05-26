import mongoose, { now, Document, Model, Schema } from "mongoose";

interface IRecipe extends Document {
  title: string;
  image: string;
  description: string;
  content: string;
  date: Date | string;
  isFeatured: boolean;
  tagId: string;
}

const recipeSchema = new Schema({
  title: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: now,
  },
  image: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    default: null,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
    default: null,
    required: false,
  },
});

export const Recipe: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", recipeSchema);
