const express = require('express');
const authController = require('../controllers/authController');
const authValidator = require('../validations/authValidator');

const router = express.Router();

router.post('/signup', authValidator.validateSignup, authController.signup);
router.post('/login', authValidator.validateLogin, authController.login);
router.post('/refresh', authValidator.validateRefreshToken, authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
