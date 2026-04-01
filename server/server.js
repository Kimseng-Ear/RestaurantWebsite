const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Route imports
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

dotenv.config();

const app = express();

const path = require('path');

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// LOG ALL REQUESTS
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gallery', galleryRoutes);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leisure-lake';
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of hanging
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('CRITICAL: MongoDB connection error:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('HINT: Your MongoDB server might not be running. Start it on 127.0.0.1:27017.');
    }
  });

const PORT = process.env.PORT || 5000;

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
