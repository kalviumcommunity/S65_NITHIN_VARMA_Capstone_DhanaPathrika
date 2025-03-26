import { getStock, addStock, updateStock } from "../controllers/stock.controller.js";
import {Router} from 'express';

const router = Router();

router.route("/getStock").get(getStock);
router.route("/addStock").post(addStock);
router.route("/update/:id").put(updateStock);

export default router;