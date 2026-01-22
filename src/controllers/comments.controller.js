import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { Comment } from "../models/comments.model.js";

const getAllCommentsOnAFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  const feedback = await Feedback.findById(feedbackId);

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const comments = await Comment.find({ feedbackId });

  return res
    .status(200)
    .json(new ApiResponse(200, { comments }, "Comments fetched successfully"));
});

const postACommentOnAFeedback = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(201, {}, "msg"));
});

const editComment = asyncHandler(async (req, res) => {
  return ApiError(404, "PEPPEPEPEPPE");
});

const deleteComment = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(201, {}, "msg"));
});

export {
  getAllCommentsOnAFeedback,
  postACommentOnAFeedback,
  editComment,
  deleteComment,
};
