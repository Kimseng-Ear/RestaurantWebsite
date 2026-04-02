const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createGalleryImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    // req.file will be populated by multer
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const imageUrl = req.file.path; // Cloudinary URL

    const newImage = await Gallery.create({ title, description, category, imageUrl });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    let updateData = { title, description, category };

    if (req.file) {
      updateData.imageUrl = req.file.path; // Cloudinary URL
    }

    const updatedImage = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedImage) return res.status(404).json({ message: 'Image not found' });

    res.json(updatedImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    // Note: To delete from Cloudinary, you'd need the public_id. 
    // We'll focus on the DB first for simplicity.
    await Gallery.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage };
