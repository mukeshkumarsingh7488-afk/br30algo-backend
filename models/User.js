import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: false, trim: true },
    proprietor: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    route: {
      type: String,
      required: true,
      enum: ["Parihar Route", "Sonbarsa Route", "All Routes"],
    },
    dealerCode: { type: String, default: "N/A" },
    role: {
      type: String,
      default: "retailer",
      enum: ["admin", "retailer", "delivery_boy"],
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Blocked"],
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    userProfilePic: {
      type: String,
      default: null,
    },
    aadharNumber: { type: String, default: "N/A" },
    panNumber: { type: String, default: "N/A" },
    previews: {
      photo: { type: String, default: null },
      aadharFront: { type: String, default: null },
      aadharBack: { type: String, default: null },
      panCard: { type: String, default: null },
      bankCheque: { type: String, default: null },
    },
    bankName: { type: String, default: "N/A" },
    accountNumber: { type: String, default: "N/A" },
    ifscCode: { type: String, default: "N/A" },
  },
  {
    timestamps: true,
  },
);

mongoose.models = {};
if (mongoose.modelNames().includes("User")) {
  mongoose.deleteModel("User");
}

const User = mongoose.model("User", userSchema);
export default User;
