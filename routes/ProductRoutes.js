const express = require("express");
const multer = require("multer");
const Product = require("../models/Products");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Add product
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      name,
      price,
      originalPrice,
      description,
      category,
      subCategory,
      brand,
      stock,
      colors,
      sizes,
      features,
      badge,
      isActive,
    } = req.body;

    const product = new Product({
      name,
      price,
      originalPrice: originalPrice || undefined,
      description,
      category,
      subCategory,
      brand,
      stock: stock || 10,
      image: req.file ? req.file.filename : "",
      images: req.file ? [req.file.filename] : [],
      colors: colors
        ? Array.isArray(colors)
          ? colors
          : colors.split(",").map((item) => item.trim())
        : [],
      sizes: sizes
        ? Array.isArray(sizes)
          ? sizes
          : sizes.split(",").map((item) => item.trim())
        : [],
      features: features
        ? Array.isArray(features)
          ? features
          : features.split(",").map((item) => item.trim())
        : [],
      badge,
      isActive: isActive !== undefined ? isActive : true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      products: [],
    });
  }
});

// Get single product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get single product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

// Update product
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      category,
      subCategory,
      brand,
      stock,
      colors,
      sizes,
      features,
      badge,
      isActive,
    } = req.body;

    const updateData = {
      name,
      price,
      originalPrice,
      description,
      category,
      subCategory,
      brand,
      stock,
      badge,
      isActive,
      colors: colors
        ? Array.isArray(colors)
          ? colors
          : colors.split(",").map((item) => item.trim())
        : [],
      sizes: sizes
        ? Array.isArray(sizes)
          ? sizes
          : sizes.split(",").map((item) => item.trim())
        : [],
      features: features
        ? Array.isArray(features)
          ? features
          : features.split(",").map((item) => item.trim())
        : [],
    };

    if (req.file) {
      updateData.image = req.file.filename;
      updateData.images = [req.file.filename];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});

// Delete product
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});

module.exports = router;