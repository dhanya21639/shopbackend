const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
});

// POST /api/payment/create-order - Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount"
      });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      message: "Razorpay order created successfully"
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create Razorpay order"
    });
  }
});

// POST /api/payment/verify - Verify payment signature
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Missing payment verification parameters"
      });
    }

    // Generate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
      .update(body.toString())
      .digest("hex");

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Payment verification failed"
    });
  }
});

// POST /api/payment/refund - Process refund (if needed)
router.post("/refund", async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        error: "Payment ID is required"
      });
    }

    const refundOptions = {
      payment_id
    };

    // Partial refund if amount is specified
    if (amount && amount > 0) {
      refundOptions.amount = amount * 100; // Convert to paise
    }

    const refund = await razorpay.refunds.create(refundOptions);

    res.json({
      success: true,
      refund,
      message: "Refund processed successfully"
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Refund failed"
    });
  }
});

// GET /api/payment/order/:orderId - Get Razorpay order details
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await razorpay.orders.fetch(orderId);

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Fetch Razorpay order error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch order details"
    });
  }
});

module.exports = router;
