const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const User = require('./models/User');
const Review = require('./models/Review');
const dotenv = require('dotenv');

dotenv.config();

const menuItems = [
  {
    name: "Seafood Fried Rice (បាយឆាគ្រឿងសមុទ្រ)",
    category: "Khmer Food",
    price: 12000,
    description: "Classic Khmer style fried rice with fresh seafood from the lake.",
    image: "https://images.unsplash.com/photo-1603133872878-08132f159942?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Lemongrass Chicken (ឆាសាច់មាន់គល់ស្លឹកគ្រៃ)",
    category: "Khmer Food",
    price: 15000,
    description: "Tender chicken stir-fried with lemongrass and holy basil.",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Grilled Frog",
    category: "Khmer Food",
    price: 10000,
    description: "Spiced grilled frog, a traditional countryside delicacy.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Anchor Beer",
    category: "Drinks",
    price: 4000,
    description: "Local favorite Cambodian lager.",
    image: "https://images.unsplash.com/photo-1535959520444-6330ce1489e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Sunset Cocktail",
    category: "Drinks",
    price: 18000,
    description: "Mixed fruit cocktail perfect for the lakeside sunset.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

const reviews = [
  { name: "Sovan", rating: 5, comment: "Best sunset view in Phnom Penh! The food is so fresh." },
  { name: "Chenda", rating: 4, comment: "Very relaxing place. Good for weekend getaway." }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leisure-lake');
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Menu.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    // Seed menu
    await Menu.insertMany(menuItems);
    console.log("Menu items seeded.");

    // Seed reviews
    await Review.insertMany(reviews);
    console.log("Reviews seeded.");

    // Seed Admin
    const admin = new User({ username: "admin", password: "password123", isAdmin: true });
    await admin.save();
    console.log("Admin account created (admin / password123).");

    console.log("Seeding complete!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
