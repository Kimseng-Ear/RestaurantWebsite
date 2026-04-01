const Review = require('../models/Review');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getReviews = async (req, res) => {
  try {
    const filter = {};
    // If not admin, only show visible reviews
    if (!req.user || req.user.role !== 'admin') {
      filter.isVisible = true;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReview = async (req, res) => {
  const { name, rating, comment } = req.body;
  try {
    const review = await Review.create({ user: req.user._id, name, rating, comment });
    
    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      type: 'REVIEW_CREATED',
      message: `New ${rating}-star review from ${name}.`,
      referenceId: review._id.toString()
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const toggleReviewVisibility = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.isVisible = !review.isVisible;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getReviews, createReview, deleteReview, toggleReviewVisibility };
