const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryStatus: {
      type: String,
      enum: ["ordered", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "ordered",
    },
    estimatedDelivery: { type: Date },
    trackingNumber: { type: String },
    pickupLocation: { type: String },
    pickedUpAt: { type: Date },
    shippingAddress: {
      fullName: String, firstName: String, lastName: String,
      email: String, phone: String, address: String,
      city: String, state: String, pincode: String, zipCode: String,
    },
    paymentMethod: { type: String, default: "card" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: { type: String },
    cancelReason: { type: String },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);