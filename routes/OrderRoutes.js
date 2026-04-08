const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST /api/orders - Create a new order
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      deliveryStatus = "ordered",
      estimatedDelivery,
      shippingAddress,
      paymentMethod = "card",
      paymentStatus = "paid"
    } = req.body;

    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, items"
      });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryStatus,
      estimatedDelivery,
      shippingAddress,
      paymentMethod,
      paymentStatus
    });

    console.log("Creating order with userId:", userId);
    const savedOrder = await newOrder.save();
    console.log("Order saved with ID:", savedOrder._id, "and userId:", savedOrder.userId);

    res.status(201).json({
      success: true,
      order: savedOrder,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order"
    });
  }
});

// GET /api/orders/user/:userId - Get all orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching orders for userId:", userId);
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    console.log("Found orders:", orders.length);

    if (!orders || orders.length === 0) {
      console.log("No orders found for userId:", userId);
      return res.json({
        success: true,
        orders: []
      });
    }

    console.log("Returning orders:", orders.map(o => ({ id: o._id, status: o.deliveryStatus })));
    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user orders"
    });
  }
});

// GET /api/orders - Get all orders (optional: for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch orders"
    });
  }
});

// GET /api/orders/:userId - Get orders by user ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user orders"
    });
  }
});

// GET /api/orders/order/:orderId - Get single order by ID
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch order"
    });
  }
});

// PUT /api/orders/:orderId - Update order status
router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    res.json({
      success: true,
      order: updatedOrder,
      message: "Order updated successfully"
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update order"
    });
  }
});

// PATCH /api/orders/:orderId/cancel - Cancel an order
router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, userId } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required"
      });
    }

    // Find the order and verify it belongs to the user
    const order = await Order.findOne({ _id: orderId, userId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found or does not belong to this user"
      });
    }

    // Check if order can be cancelled (only if it's ordered or processing)
    if (order.deliveryStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        error: "Order is already cancelled"
      });
    }

    if (order.deliveryStatus === "shipped" || order.deliveryStatus === "out_for_delivery" || order.deliveryStatus === "delivered") {
      return res.status(400).json({
        success: false,
        error: "Order cannot be cancelled once it's been shipped"
      });
    }

    // Update order to cancelled status
    const cancelledOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryStatus: "cancelled",
        cancelReason: reason || "Cancelled by customer",
        cancelledAt: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      order: cancelledOrder,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to cancel order"
    });
  }
});

module.exports = router;
