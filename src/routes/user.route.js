import { Router } from "express";
import {
  getAllUsers,
  getUser,
  editUserRole,
  softDeleteUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/user.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, requireAdmin, getAllUsers);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/:id").get(verifyJWT, requireAdmin, getUser);
router.route("/:id").patch(verifyJWT, requireAdmin, editUserRole);
router.route("/:id").delete(verifyJWT, requireAdmin, softDeleteUser);

export default router;

