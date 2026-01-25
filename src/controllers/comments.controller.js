import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Feedback } from "../models/feedback.model.js";
import { Comment } from "../models/comments.model.js";

const getAllCommentsOnAFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  // const feedback = await Feedback.findById(feedbackId);
  const feedback = await Feedback.findOne({
    _id: feedbackId,
    isDeleted: false,
  });

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const comments = await Comment.find({ feedbackId })
    .populate("authorUserId", "fullname email username")
    .sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const postACommentOnAFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    throw new ApiError(400, "Comment text is required");
  }

  if (comment.length > 5000) {
    throw new ApiError(400, "Comment text too long (max 5000 characters)");
  }

  const feedback = await Feedback.findOne({
    _id: feedbackId,
    isDeleted: false,
  });

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const postcomment = await Comment.create({
    feedbackId,
    authorUserId: req.user._id,
    comment: comment.trim(),
  });

  const populatedComment = await Comment.findById(postcomment._id).populate(
    "authorUserId",
    "fullname email username"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedComment, "Comment created successfully")
    );
});

const editComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    throw new ApiError(400, "Comment text is required");
  }

  if (comment.length > 5000) {
    throw new ApiError(400, "Comment text too long (max 5000 characters)");
  }

  const usercomment = await Comment.findById(id);
  if (!usercomment) {
    throw new ApiError(404, "Comment not found");
  }

  if (usercomment.authorUserId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own comments");
  }

  const hoursSinceCreation =
    (Date.now() - usercomment.createdAt) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new ApiError(
      403,
      "Comments can only be edited within 24 hours of creation"
    );
  }

  usercomment.comment = comment.trim();
  await usercomment.save();

  // Return with author info
  const updatedComment = await Comment.findById(id).populate(
    "authorUserId",
    "fullname email username"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.authorUserId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  await Comment.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
  getAllCommentsOnAFeedback,
  postACommentOnAFeedback,
  editComment,
  deleteComment,
};
