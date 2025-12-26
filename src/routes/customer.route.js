import { Router } from "express";
import {
  getAllCustomers,
  createACustomer,
  getOneCustomer,
} from "../controllers/customer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { requireAdmin } from "../middlewares/user.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getAllCustomers);
router.route("/create").post(verifyJWT, createACustomer);
router.route("/:id").get(verifyJWT, getOneCustomer);

export default router;
