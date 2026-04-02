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

console.log(`[DB STATUS] Attempting connection to: ${MONGO_URI.includes('mongodb+srv') ? 'Cloud Cluster ☁️' : 'Local MongoDB 🏠'}`);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000 // Extended timeout for cloud connection
})
  .then(() => console.log('[DB STATUS] ✅ Connected to MongoDB'))
  .catch(err => {
    console.error('[DB STATUS] ❌ CRITICAL CONNECTION ERROR:', err.message);
  });

// HEALTH CHECK FOR HOSTING
app.get('/', (req, res) => res.status(200).json({ status: 'API is live and aesthetic' }));

const PORT = process.env.PORT || 5000;

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
