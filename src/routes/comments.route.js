// GET    /api/feedback/:feedbackId/comments
// POST   /api/feedback/:feedbackId/comments
// PATCH  /api/comments/:id
// DELETE /api/comments/:id

import { Router } from "express";
import {
  editComment,
  deleteComment,
} from "../controllers/comments.controller.js";

const router = Router();

router.route("/:id").patch(editComment);
router.route("/:id").delete(deleteComment);

export default router;
