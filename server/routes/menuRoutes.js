const express = require('express');
const router = express.Router();
const { getMenu, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getMenu);
router.post('/', protect, adminOnly, upload.single('image'), createMenu);
router.put('/:id', protect, adminOnly, upload.single('image'), updateMenu);
router.delete('/:id', protect, adminOnly, deleteMenu);

module.exports = router;
