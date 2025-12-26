import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

/*
// const getAllUsers = asyncHandler(async (req, res) => {
//   const { username, email, fullname, role, isActive } = req.query;

//   const filter = {};

//   if (username) filter.username = username.toLowerCase();
//   if (email) filter.email = email.toLowerCase();
//   if (fullname) filter.fullname = fullname;
//   if (role) filter.role = role;
//   if (typeof isActive !== "undefined") {
//     filter.isActive = isActive === "true";
//   }

//   const users = await User.find(filter);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, users, "Users fetched successfully"));
// });
*/

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "Invalid Id.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const editUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.body;

  if (role === "undefined" || isActive === "undefined") {
    throw new ApiError(400, "Provide at least one field to update");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "Error getting user");
  }

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(id);

  if (!updatedUser) {
    throw new ApiError(400, "Failed to update acc details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User roles udpated successfully"));
});

const softDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User marked for deletion"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Details"));
});

export { getAllUsers, getUser, editUserRole, softDeleteUser, getCurrentUser };
