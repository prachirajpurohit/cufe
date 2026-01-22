<<<<<<< HEAD
import mongoose, { Schema } from "mongoose";

const statusHistorySchema = new Schema(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
    oldStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    reason: {
      type: String,
    },
    changedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const StatusHistory = mongoose.model(
  "StatusHistory",
  statusHistorySchema,
);
=======
import mongoose, { Schema } from "mongoose";

const statusHistorySchema = new Schema(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
    },
    oldStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    reason: {
      type: String,
    },
    changedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const StatusHistory = mongoose.model(
  "StatusHistory",
  statusHistorySchema,
);
>>>>>>> 8ce2638 (add models)
