import express from "express";
import {
  placeNewOrder,
  getMyOrdersHistory,
  getMasterOrdersHistory,
  updateDeliveryStatus,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/place", placeNewOrder);

router.get("/my-history", getMyOrdersHistory);

router.patch("/delivery-update/:orderId", updateDeliveryStatus);

router.use(authorize("admin"));

router.get("/master-history", getMasterOrdersHistory);

export default router;
