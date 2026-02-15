import { Feedback } from "../models/feedback.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// GET /api/v1/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Total feedback count (excluding deleted)
  const totalFeedback = await Feedback.countDocuments({ isDeleted: false });

  // 2. Breakdown by status
  const byStatus = await Feedback.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // 3. Breakdown by category
  const byCategory = await Feedback.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  // 4. Top 5 customers by feedback count
  const topCustomers = await Feedback.aggregate([
    { $match: { isDeleted: false, customerId: { $ne: null } } },
    { $group: { _id: "$customerId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" },
    {
      $project: {
        company: "$customer.company",
        count: 1,
        _id: 0,
      },
    },
  ]);

  // Format aggregation results
  const statusBreakdown = {};
  byStatus.forEach((item) => {
    statusBreakdown[item._id] = item.count;
  });

  const categoryBreakdown = {};
  byCategory.forEach((item) => {
    categoryBreakdown[item._id] = item.count;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalFeedback,
        byStatus: statusBreakdown,
        byCategory: categoryBreakdown,
        topCustomers,
      },
      "Dashboard stats fetched successfully",
    ),
  );
});

// GET /api/v1/dashboard/recent-activity
const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const recentFeedback = await Feedback.find({ isDeleted: false })
    .populate("customerId", "name company")
    .populate("createdBy", "fullname")
    .sort({ updatedAt: -1 })
    .limit(limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { recentFeedback },
        "Recent activity fetched successfully",
      ),
    );
});

export { getDashboardStats, getRecentActivity };
