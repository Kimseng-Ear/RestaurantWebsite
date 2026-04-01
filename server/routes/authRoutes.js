const express = require('express');
const router = express.Router();
const { loginUser, registerUser, googleLogin, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/google-login', googleLogin);
router.put('/change-password', protect, changePassword);

module.exports = router;
