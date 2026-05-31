import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import { uploadImageToCloud } from "../middleware/uploadMiddleware.js";

export const entryNewInvoice = async (req, res) => {
  try {
    const {
      invoiceNo,
      invoiceDate,
      vehicleNo,
      totalAmount,
      taxAmount,
      pages,
      items,
    } = req.body;

    if (!invoiceNo || !invoiceDate || !vehicleNo || !totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Invoice number, date, vehicle number and gross amount are required!",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please add at least one product item with its quantity from the invoice sheet!",
      });
    }

    if (!pages || pages.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload or click at least one image page of the invoice bill!",
      });
    }

    console.log(
      `⏳ Uploading ${pages.length} Invoice Pages of Bill '${invoiceNo}' to Cloudinary...`,
    );
    const cloudPageLinks = [];
    for (let i = 0; i < pages.length; i++) {
      const liveLink = await uploadImageToCloud(pages[i], "depot_invoices");
      cloudPageLinks.push(liveLink);
    }

    const newInvoice = new Invoice({
      invoiceNo: invoiceNo.toUpperCase().trim(),
      invoiceDate,
      vehicleNo: vehicleNo.toUpperCase().trim(),
      totalAmount: parseFloat(totalAmount),
      taxAmount: parseFloat(taxAmount || 0),
      items,
      pages: cloudPageLinks,
    });

    await newInvoice.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { depotInward: parseInt(item.qty) },
      });
      const prodToUpdate = await Product.findById(item.productId);
      if (prodToUpdate) await prodToUpdate.save();
    }

    res.status(201).json({
      success: true,
      message: `Dairy Invoice Bill '${invoiceNo}' successfully recorded and warehouse stock synchronized! ✓`,
      data: newInvoice,
    });
  } catch (error) {
    console.error(`❌ Invoice Entry Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error or cloud media upload failed.",
    });
  }
};

export const getInvoiceHistory = async (req, res) => {
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dairy audit invoice sheets.",
    });
  }
};

export const deleteInvoiceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice record not found." });
    }
    res.status(200).json({
      success: true,
      message: `Invoice bill '${deletedInvoice.invoiceNo}' successfully erased.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to erase audit bill." });
  }
};
