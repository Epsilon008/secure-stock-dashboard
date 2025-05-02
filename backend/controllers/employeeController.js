
// Importer le modèle d'employé (à ajuster selon votre implémentation)
const Employee = require('../models/employee.model');

// Récupérer tous les employés
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('equipment');
    res.json(employees);
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer un employé par ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('equipment');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer un nouvel employé
const createEmployee = async (req, res) => {
  try {
    const { name, department } = req.body;
    
    if (!name || !department) {
      return res.status(400).json({ message: 'Nom et département requis' });
    }
    
    const newEmployee = new Employee({
      name,
      department,
      equipment: []
    });
    
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour un employé
const updateEmployee = async (req, res) => {
  try {
    const { name, department } = req.body;
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, department },
      { new: true }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un employé
const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    
    res.json({ message: 'Employé supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Assigner un équipement à un employé
const assignEquipment = async (req, res) => {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ message: 'Nom et type d\'équipement requis' });
    }
    
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    
    // Créez un nouvel équipement
    const newEquipment = {
      name,
      type,
      assignedAt: new Date().toISOString().split('T')[0]
    };
    
    // Ajoutez l'équipement à l'employé
    employee.equipment.push(newEquipment);
    await employee.save();
    
    // Renvoyez le dernier équipement ajouté
    const addedEquipment = employee.equipment[employee.equipment.length - 1];
    
    res.status(201).json(addedEquipment);
  } catch (error) {
    console.error('Erreur lors de l\'attribution d\'équipement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un équipement d'un employé
const removeEquipment = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    
    // Filtrer l'équipement à supprimer
    employee.equipment = employee.equipment.filter(
      eq => eq._id.toString() !== req.params.equipmentId
    );
    
    await employee.save();
    
    res.json({ message: 'Équipement retiré avec succès' });
  } catch (error) {
    console.error('Erreur lors du retrait d\'équipement:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les équipements disponibles
const getAvailableEquipment = async (req, res) => {
  try {
    // Cette fonction devrait récupérer les équipements disponibles
    // depuis votre base de données ou autre source
    
    // Pour l'exemple, nous retournons une liste statique
    const availableEquipment = [
      { id: "av1", name: "MacBook Air", type: "laptop" },
      { id: "av2", name: "iPhone 14", type: "phone" },
      { id: "av3", name: "Dell UltraSharp 32\"", type: "monitor" },
      { id: "av4", name: "Logitech MX Master", type: "mouse" },
      { id: "av5", name: "HP EliteBook", type: "laptop" },
    ];
    
    res.json(availableEquipment);
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements disponibles:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignEquipment,
  removeEquipment,
  getAvailableEquipment
};
