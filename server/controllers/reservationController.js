const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReservation = async (req, res) => {
  const { name, phone, date, time, guests } = req.body;
  try {
    const reservation = await Reservation.create({ user: req.user._id, name, phone, date, time, guests });
    
    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      type: 'RESERVATION_CREATED',
      message: `New reservation from ${name} for ${date} at ${time}.`,
      referenceId: reservation._id.toString()
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    
    // Notify customer about status update
    await Notification.create({
      recipient: reservation.user,
      type: 'RESERVATION_UPDATED',
      message: `Your reservation for ${reservation.date} has been ${status}.`,
      referenceId: reservation._id.toString()
    });

    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const checkAvailability = async (req, res) => {
  const { date, time, guests } = req.query;
  try {
    // Quick validate hours
    const [hours, minutes] = time.split(':').map(Number);
    const timeNum = hours * 60 + minutes;
    const openingTime = 10 * 60; // 10:00 AM
    const closingTime = 22 * 60 + 30; // 10:30 PM

    if (timeNum < openingTime || timeNum > closingTime) {
      return res.json({ available: false, message: 'Outside of opening hours (10:00 AM - 10:30 PM)' });
    }

    // Check count for this date/time
    // (Simple logic: Max 8 reservations per exact time slot for demo)
    const count = await Reservation.countDocuments({ date, time, status: { $ne: 'cancelled' } });
    
    if (count >= 12) {
      return res.json({ available: false, status: 'fully_booked', message: 'Fully booked for this time' });
    } else if (count >= 8) {
       return res.json({ available: true, status: 'limited', message: 'Limited seats available' });
    } else {
      return res.json({ available: true, status: 'available', message: 'Available' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReservations, getMyReservations, createReservation, updateReservationStatus, deleteReservation, checkAvailability };
