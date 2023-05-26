import mongoose, { now, Document, Model, Schema } from "mongoose";

interface IResponse extends Document {
  text: string;
  date: Date;
  commentId: string;
}

const responseSchema = new Schema({
  text: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: now,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});

export const Response: Model<IResponse> =
  mongoose.models.Response ||
  mongoose.model<IResponse>("Response", responseSchema);
