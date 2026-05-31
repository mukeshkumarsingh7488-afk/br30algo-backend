import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeNewOrder = async (req, res) => {
  try {
    const { items, amount, paymentMode } = req.body;
    const retailerId = req.user._id;

    if (!items || items.length === 0 || !amount) {
      return res.status(400).json({
        success: false,
        message: "Cart items and total bill amount are mandatory!",
      });
    }

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: `Product '${item.name}' not found in catalog!`,
        });
      }
      if (dbProduct.currentStock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Low Stock Alert! Warehouse only has ${dbProduct.currentStock} crates of '${item.name}', but you requested ${item.qty}.`,
        });
      }
    }

    const generatedOrderId = `SUDHA-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB");
    const formattedRawDate = today.toISOString().split("T")[0];

    const newOrder = new Order({
      retailerId,
      orderId: generatedOrderId,
      items,
      amount: parseFloat(amount),
      paymentMode,
      status: "Paid & Confirmed",
      rawDate: formattedRawDate,
      date: formattedDate,
    });

    await newOrder.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { retailOutward: parseInt(item.qty) },
      });

      const prodToUpdate = await Product.findById(item.productId);
      if (prodToUpdate) await prodToUpdate.save();
    }

    res.status(201).json({
      success: true,
      message:
        "Advance payment verified and order successfully booked into depot loading queue! ✓",
      data: newOrder,
    });
  } catch (error) {
    console.error(`❌ Place Order Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error during mobile checkout processing.",
    });
  }
};

export const getMyOrdersHistory = async (req, res) => {
  try {
    const retailerId = req.user._id;

    const orders = await Order.find({ retailerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(`❌ Get My Orders Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your order portfolio from cloud network.",
    });
  }
};

export const getMasterOrdersHistory = async (req, res) => {
  try {
    const allMasterOrders = await Order.find({})
      .populate("retailerId", "shopName route proprietor mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allMasterOrders.length,
      data: allMasterOrders,
    });
  } catch (error) {
    console.error(`❌ Get Master Orders History Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to load distribution audit history sheet.",
    });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, agentId, agentName, agentMobile, paymentMethod } = req.body;

    if (!["Pending", "Delivered"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status parameter" });
    }

    const updateData = {
      deliveryStatus: status,
      deliveredAt: status === "Delivered" ? new Date() : null,
      deliveryAgent: {
        agentId: agentId || null,
        name: agentName || "Not Assigned",
        mobile: agentMobile || "N/A",
      },
    };

    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order unit not found" });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
