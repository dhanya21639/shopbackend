const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/ProductRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const invoiceRoutes = require("./routes/InvoiceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/upload", express.static(path.join(__dirname, "upload")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});