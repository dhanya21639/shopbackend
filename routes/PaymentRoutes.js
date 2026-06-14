const express = require("express");
const router = express.Router();

// POST /api/payment/create-order — Simulate payment (no Razorpay)
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    // Simulate a payment order (no real gateway)
    const fakeOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      status: "created"
    };

    res.json({
      success: true,
      order: fakeOrder,
      message: "Payment order created successfully"
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create order" });
  }
});

// POST /api/payment/verify — Always returns success (no Razorpay)
router.post("/verify", async (req, res) => {
  try {
    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Payment verification failed" });
  }
});

module.exports = router;