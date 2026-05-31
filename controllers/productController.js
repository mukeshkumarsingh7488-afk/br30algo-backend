import Product from "../models/Product.js";
import { uploadImageToCloud } from "../middleware/uploadMiddleware.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      packSize,
      unit,
      packText,
      image,
      depotInward,
      description,
    } = req.body;

    if (!name || !category || !price || !packSize || !unit || !packText) {
      return res.status(400).json({
        success: false,
        message: "All parameters except image are mandatory!",
      });
    }

    let cloudImageUrl = "🥛";
    if (image && image.startsWith("data:image")) {
      cloudImageUrl = await uploadImageToCloud(image, "product_catalog");
    } else if (image) {
      cloudImageUrl = image;
    }

    const newProduct = new Product({
      name,
      category,
      price: parseFloat(price),
      packSize: parseInt(packSize),
      unit,
      packText,
      image: cloudImageUrl,
      depotInward: parseInt(depotInward || 0),
      retailOutward: 0,
      description: description || "",
      status: "LIVE",
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: `Product '${name}' successfully listed in database catalog! ✓`,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload product parameters to cloud architecture.",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error fetching catalog matrix.",
    });
  }
};

export const updateDepotInwardStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalInward, masterEdits, statusToggle } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    if (statusToggle) {
      product.status = statusToggle;
      await product.save();
      return res.status(200).json({
        success: true,
        message: "Product visibility state updated.",
        data: product,
      });
    }

    if (masterEdits) {
      let updatedImageUrl = product.image;
      if (masterEdits.image && masterEdits.image.startsWith("data:image")) {
        updatedImageUrl = await uploadImageToCloud(
          masterEdits.image,
          "product_catalog",
        );
      }

      product.name = masterEdits.name || product.name;
      product.price = parseFloat(masterEdits.price) || product.price;
      product.description = masterEdits.description || product.description;
      product.image = updatedImageUrl;

      await product.save();
      return res.status(200).json({
        success: true,
        message: "Master catalog configurations synchronized.",
        data: product,
      });
    }

    if (additionalInward !== undefined && parseInt(additionalInward) !== 0) {
      product.depotInward += parseInt(additionalInward);
      await product.save();
      return res.status(200).json({
        success: true,
        message: "Stock sync successfully completed.",
        data: product,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid payload instructions." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to modify database boundaries.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });
    }
    res.status(200).json({
      success: true,
      message: "Item permanently erased from digital catalog.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to remove catalog node." });
  }
};
