const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['RESERVATION_CREATED', 'RESERVATION_UPDATED', 'REVIEW_CREATED', 'REVIEW_REPORTED'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  referenceId: {
    type: String // ID of the related reservation or review
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
