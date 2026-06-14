const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LUM-${timestamp.slice(-6)}${random}`;
};

router.post("/", async (req, res) => {
  try {
    const {
      userId, orderId, items, subtotal,
      discount = 0, giftWrap = false, expressDelivery = false,
      deliveryCharges = 0, totalAmount, shippingAddress,
      paymentMethod = "card", paymentStatus = "paid",
      deliveryStatus = "ordered", estimatedDelivery
    } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const invoiceNumber = generateInvoiceNumber();
    const newInvoice = new Invoice({
      userId, orderId, invoiceNumber, items, subtotal,
      discount, giftWrap, expressDelivery, deliveryCharges,
      totalAmount, shippingAddress, paymentMethod,
      paymentStatus, deliveryStatus, estimatedDelivery
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json({ success: true, invoice: savedInvoice });
  } catch (error) {
    console.error("Invoice creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.params.userId })
      .populate('orderId').sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/invoice/:invoiceId", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/number/:invoiceNumber", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;