import { ApiError } from "../utils/ApiError.js";

export const requireAdmin = (req, _, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only!");
  }
  next();
};
