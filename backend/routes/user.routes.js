
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

// Routes protégées (nécessitent un token valide)
router.get('/profile', authenticateToken, userController.getUserProfile);
router.put('/profile', authenticateToken, userController.updateUserProfile);

// Routes réservées aux administrateurs
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);

module.exports = router;
