import { Customer } from "../models/customer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Feedback } from "../models/feedback.model.js";

// * No pagination
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({});
  return res
    .status(200)
    .json(
      new ApiResponse(200, customers, "Customers list fetched successfully"),
    );
});

const createACustomer = asyncHandler(async (req, res) => {
  const { name, company, email, segment } = req.body;

  if (!name || !company || !email || !segment) {
    throw new ApiError(400, "All fields are required");
  }

  const customerExists = await Customer.findOne({
    $and: [{ name }, { email }],
  });

  if (customerExists) {
    throw new ApiError(409, "Customer already exists");
  }

  const customer = await Customer.create({
    name,
    company,
    email,
    segment,
  });

  if (!customer) {
    throw new ApiError(500, "Something went wrong while creating a customer");
  }

  // console.log(customer);

  return res
    .status(201)
    .json(new ApiResponse(201, customer, "Customer created successfully!"));
});

const getOneCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { customer }, "Profile fetched successfully"));
});

const editCustomerDetails = asyncHandler(async (req, res) => {
  const { name, company, email, segment } = req.body;
  const { id } = req.params;

  if ([name, company, email, segment].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "No fields edited");
  }

  const customer = await Customer.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name,
        company: company,
        email: email,
        segment: segment,
      },
    },
    {
      new: true,
    },
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { customer },
        "Customer details updated successfully",
      ),
    );
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "Customer Id invalid/not found");
  }

  // Check if customer has feedback first
  const feedbackCount = await Feedback.countDocuments({ customerId: id });

  if (feedbackCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete customer with ${feedbackCount} feedback items`,
    );
  }

  // await Customer.findByIdAndDelete(id);
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Customer deleted successfully"));
});

const searchCustomers = asyncHandler(async (req, res) => {
  const { q } = req.query; // Single search query

  if (!q || q.trim() === "") {
    throw new ApiError(400, "Search query required");
  }

  const customers = await Customer.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { company: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  }).limit(10);

  return res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers fetched successfully"));
});

export {
  getAllCustomers,
  createACustomer,
  getOneCustomer,
  editCustomerDetails,
  deleteCustomer,
  searchCustomers,
};
