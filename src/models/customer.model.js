<<<<<<< HEAD
import mongoose, { mongo, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    company: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
    },
    segment: {
      type: String,
      enum: ["enterprise", "mid_market", "smb", "startup"], // ✅ Add validation
      required: true,
    },
  },
  { timestamps: true },
);

export const Customer = mongoose.model("Customer", customerSchema);
=======
import mongoose, { mongo, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    company: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
    },
    segment: {
      type: String,
      enum: ["enterprise", "mid_market", "smb", "startup"], // ✅ Add validation
      required: true,
    },
  },
  { timestamps: true },
);

export const Customer = mongoose.model("Customer", customerSchema);
>>>>>>> 8ce2638 (add models)
