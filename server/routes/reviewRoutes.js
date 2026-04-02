const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview, toggleReviewVisibility } = require('../controllers/reviewController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.get('/admin', protect, authorizeRoles('admin'), getReviews);
router.post('/', protect, authorizeRoles('customer'), createReview);
router.patch('/:id/visibility', protect, authorizeRoles('admin'), toggleReviewVisibility);
router.delete('/:id', protect, authorizeRoles('admin'), deleteReview);

module.exports = router;
