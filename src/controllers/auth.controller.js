import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
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

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, role } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

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

    const createdUser = await User.findById(user._id);

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while creating user");
    }

    console.log(createdUser);

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("User creation error: ", error);
    throw new ApiError(500, "Cannot create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username/Email fields required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if(!user.isActive) {
    throw new ApiError(400, "User account deleted/marked for deletion")
  }

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedUser = await User.findById(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfullly"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!oldRefreshToken) {
    throw new ApiError(401, "Refresh token invalid/not found");
  }

  try {
    const decodedToken = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const user = await User.findById(decodedToken?._id).select("+refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found/ Bad request");
    }

    if (oldRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Tokens refreshed succesfully",
        ),
      );
  } catch (error) {
    console.log("Error:", error);
    throw new ApiError(500, "Something went wrong while refreshing the tokens");
  }
});

// const forgotPassword = asyncHandler(async (req, res) => {});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }
  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different from old password");
  }
  const user = await User.findById(req.user._id).select("+password");
  const checkPassword = await user.isPasswordCorrect(oldPassword);
  if (!checkPassword) {
    throw new ApiError(401, "Old password is incorrect");
  }
  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// const resetPassword = asyncHandler(async (req, res) => {});

export { registerUser, loginUser, logoutUser, refreshToken, changePassword };
