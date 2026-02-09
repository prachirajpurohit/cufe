import mongoose, { mongo, Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["bug", "feature_request", "improvement", "question"], // ✅ Add validation
    },
    status: {
      type: String,
      enum: [
        "new",
        "under_review",
        "planned",
        "in_progress",
        "completed",
        "wont_do",
      ],
      default: "new", // ✅ Add default
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true },
);

feedbackSchema.index({ title: 'text', description: 'text' });

export const Feedback = mongoose.model("Feedback", feedbackSchema);

