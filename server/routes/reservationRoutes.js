const express = require('express');
const router = express.Router();
const { getReservations, createReservation, updateReservationStatus, deleteReservation } = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getReservations);
router.post('/', createReservation);
router.put('/:id', protect, adminOnly, updateReservationStatus);
router.delete('/:id', protect, adminOnly, deleteReservation);

module.exports = router;
