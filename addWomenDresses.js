const mongoose = require("mongoose");
const Product = require("./models/Products");
require("dotenv").config();

// Women's dress items data
const womenDressItems = [
  {
    name: "Floral Summer Dress",
    price: 3499,
    originalPrice: 4999,
    description: "Elegant floral print summer dress with lightweight fabric and comfortable fit. Perfect for casual outings and beach vacations.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 15,
    image: "floral-dress.jpg",
    colors: ["Pink", "Blue", "Yellow"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Breathable fabric", "Floral print", "A-line cut", "Machine washable"],
    badge: "Bestseller"
  },
  {
    name: "Classic Little Black Dress",
    price: 4999,
    originalPrice: 6999,
    description: "Timeless little black dress with elegant silhouette. Perfect for evening events and special occasions.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 10,
    image: "lbd.jpg",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Premium fabric", "Bodycon fit", "Knee-length", "Dry clean only"],
    badge: "Premium"
  },
  {
    name: "Bohemian Maxi Dress",
    price: 3999,
    originalPrice: 5499,
    description: "Flowy bohemian maxi dress with intricate patterns. Ideal for festivals and beach parties.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 12,
    image: "boho-maxi.jpg",
    colors: ["Multi", "White", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Maxi length", "Bohemian print", "Elastic waist", "Side pockets"],
    badge: "Trending"
  },
  {
    name: "Cocktail Party Dress",
    price: 5999,
    originalPrice: 7999,
    description: "Stunning cocktail dress with sequin details. Perfect for parties and night outs.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 8,
    image: "cocktail-dress.jpg",
    colors: ["Gold", "Silver", "Rose Gold"],
    sizes: ["S", "M", "L"],
    features: ["Sequin embellished", "Bodycon", "Short length", "Back zipper"],
    badge: "New Arrival"
  },
  {
    name: "Casual Shirt Dress",
    price: 2499,
    originalPrice: 3499,
    description: "Comfortable shirt dress with belt. Perfect for office and casual wear.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 20,
    image: "shirt-dress.jpg",
    colors: ["White", "Blue", "Beige"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["Shirt collar", "Removable belt", "Roll-up sleeves", "Front pockets"],
    badge: "Casual"
  },
  {
    name: "Wedding Guest Dress",
    price: 6999,
    originalPrice: 8999,
    description: "Elegant dress perfect for wedding guests and formal events. Sophisticated and stylish.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 6,
    image: "wedding-dress.jpg",
    colors: ["Wine", "Navy", "Emerald"],
    sizes: ["S", "M", "L"],
    features: ["Lace details", "Floor-length", "V-neck", "Hidden zipper"],
    badge: "Exclusive"
  },
  {
    name: "Summer Sundress",
    price: 1999,
    originalPrice: 2999,
    description: "Light and breezy sundress perfect for summer days. Comfortable and stylish.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 25,
    image: "sundress.jpg",
    colors: ["Orange", "Yellow", "Pink"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Spaghetti straps", "Floral pattern", "Lightweight", "Easy care"],
    badge: "Summer Special"
  },
  {
    name: "Office Work Dress",
    price: 3499,
    originalPrice: 4499,
    description: "Professional work dress appropriate for office environment. Comfortable for all-day wear.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 15,
    image: "office-dress.jpg",
    colors: ["Black", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Pencil cut", "Knee-length", "Notch collar", "Side slit"],
    badge: "Work Wear"
  },
  {
    name: "Beach Cover-up Dress",
    price: 1799,
    originalPrice: 2499,
    description: "Lightweight beach cover-up dress. Perfect for pool and beach days.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 30,
    image: "beach-coverup.jpg",
    colors: ["White", "Turquoise", "Coral"],
    sizes: ["S", "M", "L", "XL"],
    features: ["Sheer fabric", "Loose fit", "Hooded", "Quick dry"],
    badge: "Beach Essential"
  },
  {
    name: "Date Night Dress",
    price: 4499,
    originalPrice: 5999,
    description: "Romantic dress perfect for date nights and special occasions. Elegant and flattering.",
    category: "women",
    subCategory: "dresses",
    brand: "Maison Lumière",
    stock: 10,
    image: "date-night-dress.jpg",
    colors: ["Red", "Black", "Burgundy"],
    sizes: ["S", "M", "L"],
    features: ["Bodycon", "Off-shoulder", "Mini length", "Stretch fabric"],
    badge: "Romantic"
  }
];

async function addWomenDresses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing women's dresses (optional)
    await Product.deleteMany({ category: "women", subCategory: "dresses" });
    console.log("Cleared existing women's dresses");

    // Add new women's dresses
    const addedProducts = await Product.insertMany(womenDressItems);
    console.log(`Added ${addedProducts.length} women's dress items successfully!`);

    // List added products
    addedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
    });

  } catch (error) {
    console.error("Error adding women's dresses:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the function
addWomenDresses();
