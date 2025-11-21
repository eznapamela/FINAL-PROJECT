const express = require('express');
const router = express.Router();
const { authenticateAnonymous } = require('../middleware/auth');
const { createAnonymousUser, validateToken } = require('../controllers/userController');

// Create anonymous user
router.post('/anonymous', createAnonymousUser);

// Validate token
router.get('/validate', authenticateAnonymous, validateToken);

module.exports = router;