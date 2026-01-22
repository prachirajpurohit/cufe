import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User doesn't exists!");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error in generating tokens", error);
    throw new ApiError(500, "Error in generating tokens");
  }
};

const getAllUsers = asyncHandler(async (req, res) => {
  const { username, email, fullname, role, isActive } = req.query;

  const filter = {};

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  try {
    const user = await User.create({
      fullname,
      username: username.toLowerCase(),
      email,
      password,
      role,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while creating user");
  }

  const users = await User.find(filter);

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", createdUser));
  } catch (error) {
    console.log("User creation error: ", error);
    throw new ApiError(500, "Cannot create user");
  }
});

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
  // console.log(updatedUser);

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
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "Invalid Id.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User marked for deletion"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Details"));
});

export { getAllUsers, getUser, editUserRole, softDeleteUser, getCurrentUser };