import { getInvoices, createInvoice } from "../controllers/invoice.controller.js";
import { Router } from 'express';

const router = Router();

router.route("/getInvoices").get(getInvoices);
router.route("/createInvoice").post(createInvoice);

export default router;