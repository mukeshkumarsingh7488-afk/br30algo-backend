import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    invoiceDate: {
      type: String,
      required: true,
    },
    vehicleNo: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    route: {
      type: String,
      required: true,
      enum: ["Parihar Route", "Sonbarsa Route"],
      default: "Parihar Route",
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
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pages: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

mongoose.models = {};
if (mongoose.modelNames().includes("Invoice")) {
  mongoose.deleteModel("Invoice");
}

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
