import { getProfile } from "../controllers/profile.controller.js";
import { Router } from "express";

const router = Router();

router.route("/getProfile").get(getProfile);

export default router;