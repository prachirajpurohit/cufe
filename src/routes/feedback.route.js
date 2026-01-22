import { Router } from "express";

import {
  getAllFeedback,
  postAFeedback,
  getAFeedback,
  editFeedback,
  changeFeedbackStatus,
  getFeedbackHistory,
  softDeleteFeedback,
} from "../controllers/feedback.controller.js";

import {
  getAllCommentsOnAFeedback,
  postACommentOnAFeedback,
} from "../controllers/comments.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllFeedback);
router.route("/").post(verifyJWT, postAFeedback);
router.route("/:id").get(getAFeedback);
router.route("/:id").patch(editFeedback);
router.route("/:id").delete(softDeleteFeedback);
router.route("/:id/status").patch(verifyJWT, changeFeedbackStatus);
router.route("/:id/history").get(getFeedbackHistory);

// GET    /api/feedback/:feedbackId/comments
// POST   /api/feedback/:feedbackId/comments

router.route("/:feedbackId/comments").get(getAllCommentsOnAFeedback);
router.route("/:feedbackId/comments").post(postACommentOnAFeedback);

export default router;
