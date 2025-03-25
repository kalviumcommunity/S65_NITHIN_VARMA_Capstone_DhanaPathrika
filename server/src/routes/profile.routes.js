import { getProfile, addProfile } from "../controllers/profile.controller.js";
import { Router } from "express";

const router = Router();

router.route("/getProfile").get(getProfile);
router.route("/addProfile").post(addProfile);

export default router;