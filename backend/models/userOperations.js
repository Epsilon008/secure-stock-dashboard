
const bcrypt = require('bcrypt');
const { getDB } = require('../config/db');
const { findUserByUsername, findUserById } = require('./userDB');

async function createUser(userData) {
  try {
    const existingUser = await findUserByUsername(userData.username);
    if (existingUser) {
      throw new Error("Ce nom d'utilisateur existe déjà");
    }
    
    const db = await getDB();
    if (!db) throw new Error("Base de données non disponible");
    
    if (!db.users) {
      db.users = [];
    }
    
    const countUsers = db.users.length;
    const id = String(countUsers + 1);
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      id,
      username: userData.username,
      password: hashedPassword,
      role: userData.role || 'user',
      department: userData.department,
      fullName: userData.fullName,
      email: userData.email,
      createdAt: new Date()
    };
    
    db.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur:", error);
    throw error;
  }
}

async function updateUser(id, userData) {
  try {
    const updateData = {};
    if (userData.username) updateData.username = userData.username;
    if (userData.department) updateData.department = userData.department;
    if (userData.role) updateData.role = userData.role;
    if (userData.fullName) updateData.fullName = userData.fullName;
    if (userData.email) updateData.email = userData.email;
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const db = await getDB();
    if (!db) throw new Error("Base de données non disponible");
    
    const userIndex = db.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }
    
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updateData
    };
    
    return await findUserById(id);
  } catch (error) {
    console.error("Erreur lors de la mise à jour d'utilisateur:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  updateUser
};
