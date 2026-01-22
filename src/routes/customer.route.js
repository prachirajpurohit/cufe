import { Router } from "express";
import {
  getAllCustomers,
  createACustomer,
  getOneCustomer,
  editCustomerDetails,
  deleteCustomer,
  searchCustomers,
} from "../controllers/customer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/user.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/search").get(searchCustomers);

router.route("/").get(getAllCustomers);
router.route("/").post(createACustomer);
router.route("/:id").get(getOneCustomer);
router.route("/:id").patch(editCustomerDetails);
router.route("/:id").delete(requireAdmin, deleteCustomer);

export default router;
