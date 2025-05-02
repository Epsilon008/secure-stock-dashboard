
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const employeeRoutes = require('./employee.routes');

// Routes publiques
router.use('/auth', authRoutes);

// Routes protégées
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;
