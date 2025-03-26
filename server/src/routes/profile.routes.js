import { getProfile, addProfile, updateProfile } from "../controllers/profile.controller.js";
import { Router } from "express";

const router = Router();

router.route("/getProfile").get(getProfile);
router.route("/addProfile").post(addProfile);
router.route("/updateProfile").put(updateProfile);

export default router;