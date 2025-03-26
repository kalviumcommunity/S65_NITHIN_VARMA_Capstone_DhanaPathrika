import { getInvoices, createInvoice, updateInvoice } from "../controllers/invoice.controller.js";
import { Router } from 'express';

const router = Router();

router.route("/getInvoices").get(getInvoices);
router.route("/createInvoice").post(createInvoice);
router.route("/updateInvoice/:id").put(updateInvoice);

export default router;