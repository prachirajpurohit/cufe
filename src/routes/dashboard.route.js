import { Router } from "express";
import {
  getDashboardStats,
  getRecentActivity,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Auth required

router.route("/").get(getDashboardStats);
router.route("/recent-activity").get(getRecentActivity);

export default router;
