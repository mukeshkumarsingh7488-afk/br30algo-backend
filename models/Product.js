import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Milk",
        "Dahi",
        "Paneer",
        "Ghee",
        "Drink & Beverages",
        "Icecream",
        "Sweet",
        "Other product",
      ],
    },
    price: { type: Number, required: true, min: 0 },
    packSize: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true, enum: ["Ltr", "Pcs"] },
    packText: { type: String, required: true, trim: true },
    image: { type: String, default: "🥛" },
    description: { type: String, default: "" },

    status: {
      type: String,
      default: "LIVE",
      enum: ["LIVE", "HIDDEN"],
    },

    depotInward: { type: Number, default: 0 },
    retailOutward: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  this.currentStock = this.depotInward - this.retailOutward;
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
