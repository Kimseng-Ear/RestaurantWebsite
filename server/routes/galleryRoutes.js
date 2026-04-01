const express = require('express');
const router = express.Router();
const { getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public route
router.get('/', getGallery);

// Admin only routes
router.post('/', protect, authorizeRoles('admin'), upload.single('image'), createGalleryImage);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateGalleryImage);
router.delete('/:id', protect, authorizeRoles('admin'), deleteGalleryImage);

module.exports = router;
