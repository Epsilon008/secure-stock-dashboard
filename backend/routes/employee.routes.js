
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/auth.middleware');

// Routes protégées par authentification
router.use(authMiddleware);

// Routes pour les employés
router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Routes pour les équipements
router.post('/:id/equipment', employeeController.assignEquipment);
router.delete('/:id/equipment/:equipmentId', employeeController.removeEquipment);
router.get('/equipment/available', employeeController.getAvailableEquipment);

module.exports = router;
