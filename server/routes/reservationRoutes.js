const express = require('express');
const router = express.Router();
const { getReservations, getMyReservations, createReservation, updateReservationStatus, deleteReservation } = require('../controllers/reservationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('admin'), getReservations);
router.get('/my', protect, authorizeRoles('customer'), getMyReservations);
router.post('/', protect, authorizeRoles('customer'), createReservation);
router.put('/:id', protect, authorizeRoles('admin'), updateReservationStatus);
router.delete('/:id', protect, authorizeRoles('admin'), deleteReservation);

module.exports = router;
