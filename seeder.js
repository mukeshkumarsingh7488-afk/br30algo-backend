import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const seedDataEngine = async () => {
  try {
    const liveMongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOSTS}/${process.env.DB_NAME}?${process.env.DB_OPTIONS}`;
    await mongoose.connect(liveMongoURI);
    console.log("📡 Seeder Connected to MongoDB Atlas Cloud...");

    await User.deleteMany();
    await Product.deleteMany();
    console.log("🧹 Old Database Truncated Cleanly.");

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash("Admin@2026", salt);

    const masterAdmin = new User({
      shopName: "Sudha Dairy Main Agency",
      proprietor: "Mukesh Kumar Singh",
      mobile: "9999999999",
      email: "support.br30trader@gmail.com",
      password: hashedAdminPassword,
      route: "Parihar Route",
      dealerCode: "AGENCY-001",
      role: "admin",
      status: "Active",
      aadharNumber: "000000000000",
      panNumber: "SUDHA0001A",
      bankName: "State Bank of India",
      accountNumber: "00000000000",
      ifscCode: "SBIN0000001",
    });

    await masterAdmin.save();
    console.log("👑 Master Admin Account Successfully Injected! ✓");

    const initialProductsList = [
      {
        name: "Sudha Premium Milk 500ml",
        category: "Milk",
        price: 260,
        packSize: 10,
        unit: "Ltr",
        packText: "1 Crate (10 Ltr / 20 Pcs)",
        image: "🥛",
        depotInward: 1200,
        retailOutward: 750,
        currentStock: 450,
      },
      {
        name: "Sudha Full Cream Milk 1000ml",
        category: "Milk",
        price: 720,
        packSize: 12,
        unit: "Ltr",
        packText: "1 Crate (12 Ltr / 12 Pcs)",
        image: "🥛",
        depotInward: 800,
        retailOutward: 600,
        currentStock: 200,
      },
      {
        name: "Sudha Plain Dahi 200g",
        category: "Dahi",
        price: 720,
        packSize: 24,
        unit: "Pcs",
        packText: "1 Box (24 Pcs)",
        image: "🥣",
        depotInward: 400,
        retailOutward: 280,
        currentStock: 120,
      },
      {
        name: "Sudha Lassi 200ml",
        category: "Lassi",
        price: 240,
        packSize: 24,
        unit: "Pcs",
        packText: "1 Box (24 Pcs)",
        image: "🥤",
        depotInward: 1500,
        retailOutward: 1465,
        currentStock: 35,
      },
      {
        name: "Sudha Premium Ghee 1L",
        category: "Ghee",
        price: 7560,
        packSize: 12,
        unit: "Pcs",
        packText: "1 Carton (12 Pcs)",
        image: "⚱️",
        depotInward: 150,
        retailOutward: 65,
        currentStock: 85,
      },
    ];

    await Product.insertMany(initialProductsList);
    console.log(
      "📦 5 Core Sudha Products & Live Stock Matrices Successfully Injected! ✓",
    );

    console.log(
      "🏁 Database Seeding Task Finished Perfectly! Closing connection...",
    );
    process.exit();
  } catch (error) {
    console.error(`❌ Seeder Script Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDataEngine();
