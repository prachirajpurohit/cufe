<<<<<<< HEAD
import mongoose, { mongo, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
=======
import mongoose, { mongo, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Comment = mongoose.model("Comment", commentSchema);
>>>>>>> 8ce2638 (add models)
