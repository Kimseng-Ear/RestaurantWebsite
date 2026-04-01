const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Food', 'Interior', 'Events', 'Drinks', 'Lake View', 'Sunset', 'Dining Area', 'All'], default: 'Interior' }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
