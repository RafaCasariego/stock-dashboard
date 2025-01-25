const express = require('express');
const { sendEmailHandler } = require('../controllers/emailController');
const router = express.Router();

// Ruta POST para enviar un email
router.post('/', sendEmailHandler);

module.exports = router;
