import express from "express";
import {
  entryNewInvoice,
  getInvoiceHistory,
  deleteInvoiceRecord,
} from "../controllers/invoiceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/history", getInvoiceHistory);

router.use(authorize("admin"));

router.post("/entry", entryNewInvoice);

router.delete("/delete/:id", deleteInvoiceRecord);

export default router;
