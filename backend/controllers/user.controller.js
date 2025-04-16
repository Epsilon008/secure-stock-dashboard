
const UserModel = require('../models/user.model');

async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await UserModel.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, password, department } = req.body;
    
    // Mise à jour de l'utilisateur
    const updatedUser = await UserModel.updateUser(userId, {
      username,
      password,
      department
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const db = await require('../config/db').getDB();
    const users = await db.collection('users').find({}).toArray();
    
    // Retirer les mots de passe
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers
};
