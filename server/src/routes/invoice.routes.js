import { createInvoice, getInvoices, updateInvoice, deleteInvoice } from "../controllers/invoice.controller.js";
import { Router } from 'express';

const router = Router();

router.route("/getInvoices").get(getInvoices);

export default router;