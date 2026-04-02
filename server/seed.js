const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const User = require('./models/User');
const Review = require('./models/Review');
const dotenv = require('dotenv');

dotenv.config();

const menuItems = [
  {
    name: "Seafood Fried Rice",
    khmerName: "បាយឆាគ្រឿងសមុទ្រ",
    category: "Khmer Food",
    price: 12000,
    description: "Classic Khmer style fried rice with fresh seafood from the lake.",
    image: "https://images.unsplash.com/photo-1603133872878-08132f159942?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Lemongrass Chicken",
    khmerName: "ឆាសាច់មាន់គល់ស្លឹកគ្រៃ",
    category: "Khmer Food",
    price: 15000,
    description: "Tender chicken stir-fried with lemongrass and holy basil.",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Grilled Frog",
    khmerName: "កង្កែបអាំង",
    category: "Khmer Food",
    price: 10000,
    description: "Spiced grilled frog, a traditional countryside delicacy.",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Anchor Beer",
    khmerName: "ស្រាបៀរ Anchor",
    category: "Drinks",
    price: 4000,
    description: "Local favorite Cambodian lager.",
    image: "https://images.unsplash.com/photo-1535959520444-6330ce1489e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    name: "Sunset Cocktail",
    khmerName: "Sunset Cocktail",
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

    // 1. SEED MENU (UPSERT)
    for (const item of menuItems) {
      await Menu.findOneAndUpdate(
        { name: item.name },
        item,
        { upsert: true, new: true }
      );
    }
    console.log("Menu items synchronized (Find-or-Create).");

    // Set first dish as featured for better landing page UX
    await Menu.findOneAndUpdate({ name: "Seafood Fried Rice" }, { isFeatured: true });

    // 2. SEED ADMIN (UPSERT)
    const adminEmail = "admin@leisurelake.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: "password123",
        role: "admin",
        provider: "LOCAL"
      });
      await admin.save();
      console.log("Admin account created.");
    } else {
      console.log("Admin account already verified.");
    }

    // 3. SEED GUEST (UPSERT)
    const guestEmail = "guest@leisurelake.com";
    let customer = await User.findOne({ email: guestEmail });
    if (!customer) {
      customer = new User({
        name: "Guest User",
        email: guestEmail,
        password: "password123",
        role: "customer"
      });
      await customer.save();
    }

    // 4. SEED REVIEWS (UPSERT)
    for (const r of reviews) {
      await Review.findOneAndUpdate(
        { name: r.name, comment: r.comment },
        { ...r, user: customer._id },
        { upsert: true }
      );
    }
    console.log("Standard reviews synchronized.");

    console.log("Seeding complete! (Safe Mode: No existing data was deleted)");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
