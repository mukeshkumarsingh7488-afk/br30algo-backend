import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        packText: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      required: true,
      enum: ["upi", "wallet", "card", "cod"],
      default: "upi",
    },
    status: {
      type: String,
      required: true,
      enum: ["Paid & Confirmed", "Dispatched", "Delivered", "Pending"],
      default: "Paid & Confirmed",
    },
    rawDate: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    deliveryAgent: {
      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      name: { type: String, default: "Not Assigned" },
      mobile: { type: String, default: "N/A" },
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
