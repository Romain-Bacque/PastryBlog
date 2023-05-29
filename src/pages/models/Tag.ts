import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITag extends Document {
  tag: string;
}

const tagSchema = new Schema({
  tag: {
    type: String,
    default: null,
  },
});

export const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", tagSchema);
