const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.post('/', protect, authorizeRoles('customer'), createReview);
router.delete('/:id', protect, authorizeRoles('admin'), deleteReview);

module.exports = router;
