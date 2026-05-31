import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sudha Dairy Live Cloud Backend Engine is Active & Running! 📡",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
  console.error(`❌ Global Server Error Log: ${err.message}`);
  res.status(500).json({
    success: false,
    message: "Something went wrong inside the server backend!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `================================================================`,
  );
  console.log(`🚀 BR30KART SUDHA DISTRIBUTION SERVER IS ALIVE AND WORKING!`);
  console.log(`📡 RUNNING ON PORT: ${PORT}`);
  console.log(`⚙️ ENVIRONMENT MODE: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `================================================================`,
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`⚠️ Unhandled Rejection Error: ${err.message}`);
});
