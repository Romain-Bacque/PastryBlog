import mongoose, { now, Document, Model, Schema } from "mongoose";

interface IComment extends Document {
  name: string;
  email: string;
  text: string;
  date: Date;
  pastryId: string;
}

const commentSchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: now,
  },
  pastryId: {
    type: Schema.Types.ObjectId,
    ref: "Pastry",
    required: true,
  },
});

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
