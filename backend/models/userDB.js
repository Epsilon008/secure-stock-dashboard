
const { getDB } = require('../config/db');

const COLLECTION_NAME = 'users';

async function findUserByUsername(username) {
  try {
    const db = await getDB();
    if (!db) return null;
    return db.users.find(user => user.username === username);
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateur:", error);
    throw error;
  }
}

async function findUserById(id) {
  try {
    const db = await getDB();
    if (!db) return null;
    return db.users.find(user => user.id === id);
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateur par ID:", error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const db = await getDB();
    if (!db || !db.users) return [];
    
    const users = [...db.users];
    
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
}

module.exports = {
  COLLECTION_NAME,
  findUserByUsername,
  findUserById,
  getAllUsers
};
