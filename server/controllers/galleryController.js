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
    const imageUrl = `/uploads/${req.file.filename}`;

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
      const oldImage = await Gallery.findById(id);
      if (oldImage?.imageUrl && oldImage.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', oldImage.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
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

    if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', image.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage };
