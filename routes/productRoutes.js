import express from "express";
import {
  addProduct,
  getAllProducts,
  updateDepotInwardStock,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllProducts);

router.use(authorize("admin"));

router.post("/add", addProduct);

router.put("/update-stock/:id", updateDepotInwardStock);

router.delete("/delete/:id", deleteProduct);

export default router;
