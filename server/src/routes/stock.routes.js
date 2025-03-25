import { getStock, addStock } from "../controllers/stock.controller.js";
import {Router} from 'express';

const router = Router();

router.route("/getStock").get(getStock);
router.route("/addStock").post(addStock);

export default router;