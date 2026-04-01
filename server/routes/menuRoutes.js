const express = require('express');
const router = express.Router();
const { getMenu, createMenu, updateMenu, deleteMenu, getFeaturedMenu, setFeaturedMenu } = require('../controllers/menuController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getMenu);
router.get('/featured', getFeaturedMenu);
router.post('/', protect, authorizeRoles('admin'), upload.single('image'), createMenu);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateMenu);
router.put('/:id/feature', protect, authorizeRoles('admin'), setFeaturedMenu);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMenu);

module.exports = router;
