import express from "express";
import {
  registerRetailer,
  getAllRetailers,
  toggleRetailerStatus,
  deleteRetailer,
  sendRegistrationOtp,
  updateRetailerProfile,
  rechargeRetailerWallet,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getSingleRetailerProfile,
  registerDeliveryBoyNode,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendRegistrationOtp);

router.use(protect);

router.get(
  "/profile",
  authorize("admin", "delivery_boy", "retailer"),
  getSingleRetailerProfile,
);
router.post(
  "/update-profile",
  authorize("admin", "delivery_boy", "retailer"),
  updateRetailerProfile,
);

router.put("/update-profile/:id", authorize("admin"), updateRetailerProfile);
router.get("/profile/:id", authorize("admin"), getSingleRetailerProfile);
router.put("/recharge-wallet/:id", authorize("admin"), rechargeRetailerWallet);
router.post(
  "/create-razorpay-order",
  authorize("admin", "retailer"),
  createRazorpayOrder,
);
router.post(
  "/verify-razorpay-payment",
  authorize("admin", "retailer"),
  verifyRazorpayPayment,
);

router.post("/register", authorize("admin"), registerRetailer);
router.post("/register-agent", authorize("admin"), registerDeliveryBoyNode);
router.get("/list", authorize("admin"), getAllRetailers);
router.patch("/toggle-status/:id", authorize("admin"), toggleRetailerStatus);
router.delete("/delete/:id", deleteRetailer);

export default router;
