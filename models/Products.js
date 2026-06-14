
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String },
    brand: { type: String },
    stock: { type: Number, default: 10 },
    image: { type: String },
    images: [{ type: String }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    features: [{ type: String }],
    badge: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

