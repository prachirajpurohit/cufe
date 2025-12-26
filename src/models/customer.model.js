import mongoose, { mongo, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
    },
    company: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    segment: {
      type: String,
      enum: ["enterprise", "mid_market", "smb", "startup"], // ✅ Add validation
    },
  },
  { timestamps: true },
);

export const Customer = mongoose.model("Customer", customerSchema);
