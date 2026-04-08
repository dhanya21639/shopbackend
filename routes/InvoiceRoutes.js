const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${timestamp.slice(-6)}${random}`;
};

// POST /api/invoices - Create a new invoice
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      orderId,
      items,
      subtotal,
      discount = 0,
      giftWrap = false,
      expressDelivery = false,
      deliveryCharges = 0,
      totalAmount,
      shippingAddress,
      paymentMethod = "card",
      paymentStatus = "paid",
      deliveryStatus = "ordered",
      estimatedDelivery
    } = req.body;

    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, items"
      });
    }

    // Generate unique invoice number
    const invoiceNumber = generateInvoiceNumber();

    // Create new invoice
    const newInvoice = new Invoice({
      userId,
      orderId,
      invoiceNumber,
      items,
      subtotal,
      discount,
      giftWrap,
      expressDelivery,
      deliveryCharges,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      estimatedDelivery
    });

    const savedInvoice = await newInvoice.save();

    res.status(201).json({
      success: true,
      invoice: savedInvoice,
      message: "Invoice created successfully"
    });
  } catch (error) {
    console.error("Invoice creation error:", error);
    
    // Handle duplicate invoice number error
    if (error.code === 11000 && error.keyPattern?.invoiceNumber) {
      // Try again with a new invoice number
      return res.status(500).json({
        success: false,
        error: "Invoice number generation conflict. Please try again."
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create invoice"
    });
  }
});

// GET /api/invoices - Get all invoices (optional: for admin)
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('userId', 'name email')
      .populate('orderId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      invoices
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch invoices"
    });
  }
});

// GET /api/invoices/:userId - Get invoices by user ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const invoices = await Invoice.find({ userId })
      .populate('orderId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      invoices
    });
  } catch (error) {
    console.error("Get user invoices error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user invoices"
    });
  }
});

// GET /api/invoices/invoice/:invoiceId - Get single invoice by ID
router.get("/invoice/:invoiceId", async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId)
      .populate('userId', 'name email')
      .populate('orderId');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found"
      });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch invoice"
    });
  }
});

// GET /api/invoices/number/:invoiceNumber - Get invoice by invoice number
router.get("/number/:invoiceNumber", async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const invoice = await Invoice.findOne({ invoiceNumber })
      .populate('userId', 'name email')
      .populate('orderId');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: "Invoice not found"
      });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error("Get invoice by number error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch invoice"
    });
  }
});

module.exports = router;
