import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Feedback } from "../models/feedback.model.js";
import { Customer } from "../models/customer.model.js";
import { StatusHistory } from "../models/status-history.model.js";

const getAllFeedback = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    category,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = { isDeleted: false };

  if (search) {
    filter.$text = { $search: search };
  }

  if (status) {
    const statuses = status.split(",");
    filter.status = { $in: statuses };
  }

  if (category) {
    const categories = categories.split(",");
    filter.category = { $in: categories };
  }

  const feedback = await Feedback.find(filter)
    .populate("customerId ", "name company segment")
    .populate("createdBy", "fullname email")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, feedback, "Feedback fetched successfully"));
});

const postAFeedback = asyncHandler(async (req, res) => {
  // Step 1: Extract and validate input
  const { title, description, category, customer: customerInfo } = req.body;

  if (!title || !description || !category) {
    throw new ApiError(400, "Title, description, and category are required");
  }

  if (
    !customerInfo ||
    !customerInfo.name ||
    !customerInfo.company ||
    !customerInfo.email ||
    !customerInfo.segment
  ) {
    throw new ApiError(400, "Complete customer information required");
  }

  // Step 2: Customer linking logic
  // Check if customer already exists (by name + company)
  let customer = await Customer.findOne({
    name: customerInfo.name,
    company: customerInfo.company,
  });

  // If customer doesn't exist, create new one
  if (!customer) {
    customer = await Customer.create({
      name: customerInfo.name,
      company: customerInfo.company,
      email: customerInfo.email,
      segment: customerInfo.segment,
    });
  }

  // Step 3: Create feedback
  const feedback = await Feedback.create({
    title,
    description,
    category,
    status: "new", // Always starts as new
    isDeleted: false, // Never deleted when created
    createdBy: req.user._id, // From auth middleware
    customerId: customer._id, // Linked to customer
  });

  // Step 4: Log initial status in history
  await StatusHistory.create({
    feedbackId: feedback._id,
    oldStatus: null,
    newStatus: "new",
    reason: "Feedback created",
    changedByUserId: req.user._id,
  });

  // Step 5: Return populated feedback
  const populatedFeedback = await Feedback.findById(feedback._id)
    .populate("customerId")
    .populate("createdBy", "fullname email username");

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedFeedback, "Feedback created successfully"),
    );
});

const getAFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findOne({ _id: id, isDeleted: false })
    .populate("customerId")
    .populate("createdBy", "fullname email username");

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, feedback, "Feedback fetched successfully"));
});

const editFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  // Build update object with only provided fields
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (category !== undefined) updates.category = category;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field required to update");
  }

  const feedback = await Feedback.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: updates },
    { new: true },
  )
    .populate("customerId")
    .populate("createdBy", "fullname email username");

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { feedback }, "Feedback updated successfully"));
});

const changeFeedbackStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  // Validate status
  const validStatuses = [
    "new",
    "under_review",
    "planned",
    "in_progress",
    "completed",
    "wont_do",
  ];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status. Must be one of: " + validStatuses.join(", "),
    );
  }

  if (status === "wont_do" && !reason) {
    throw new ApiError(400, "Reason required when marking as 'won't do'");
  }

  // Get current feedback
  const feedback = await Feedback.findOne({ _id: id, isDeleted: false });
  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  const oldStatus = feedback.status;

  if (oldStatus === status) {
    throw new ApiError(400, `Status is already '${status}'`);
  }

  feedback.status = status;
  await feedback.save();

  // Log status change
  await StatusHistory.create({
    feedbackId: id,
    oldStatus: oldStatus,
    newStatus: status,
    reason: reason || null,
    changedByUserId: req.user._id,
  });

  const updatedFeedback = await Feedback.findById(id)
    .populate("customerId")
    .populate("createdBy", "fullname email username");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFeedback, "Status updated successfully"));
});

const getFeedbackHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if feedback exists
  const feedback = await Feedback.findOne({ _id: id, isDeleted: false });
  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  // Get all status changes
  const history = await StatusHistory.find({ feedbackId: id })
    .populate("changedByUserId", "fullname email")
    .sort({ changedAt: -1 }); // Newest first

  return res
    .status(200)
    .json(new ApiResponse(200, history, "Status history fetched successfully"));
});

const softDeleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true },
  );

  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Feedback deleted successfully"));
});

export {
  getAllFeedback,
  postAFeedback,
  getAFeedback,
  editFeedback,
  changeFeedbackStatus,
  getFeedbackHistory,
  softDeleteFeedback,
};
