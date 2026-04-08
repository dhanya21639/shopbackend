const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
  category: { type: String },
  brand: { type: String },
  size: { type: String },
  color: { type: String },
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    giftWrap: { type: Boolean, default: false },
    expressDelivery: { type: Boolean, default: false },
    deliveryCharges: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      zipCode: String,
    },
    paymentMethod: { type: String, default: "card" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },
    deliveryStatus: {
      type: String,
      enum: ["ordered", "processing", "shipped", "delivered", "cancelled"],
      default: "ordered",
    },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

// ✅ Invoice number is generated in the route (index.js) before saving.
// No pre-save hook needed — it was causing "next is not a function" error.

module.exports = mongoose.model("Invoice", invoiceSchema);