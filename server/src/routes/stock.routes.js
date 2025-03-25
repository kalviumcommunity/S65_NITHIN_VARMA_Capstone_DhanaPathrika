import { getStock } from "../controllers/stock.controller.js";
import {Router} from 'express';

const router = Router();

router.route("/getStock").get(getStock);

export default router;