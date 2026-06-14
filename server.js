require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// Import all routes
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const invoiceRoutes = require("./routes/InvoiceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make upload folder public
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Routes
app.use("/api", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});