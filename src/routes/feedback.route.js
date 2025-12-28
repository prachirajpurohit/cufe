import { Router } from "express";
import {

} from "../controllers/feedback.controller.js"

const router = Router();

router.route("/").get();

export default router