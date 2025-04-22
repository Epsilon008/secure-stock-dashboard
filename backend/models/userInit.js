
const bcrypt = require('bcrypt');
const { getDB } = require('../config/db');

async function initializeDefaultUsers() {
  try {
    const db = await getDB();
    if (!db) throw new Error("Base de données non disponible");
    
    if (!db.users) {
      db.users = [];
    }
    
    if (db.users.length === 0) {
      db.users = [
        {
          id: "1",
          username: "admin",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
          createdAt: new Date()
        },
        {
          id: "2",
          username: "user",
          password: await bcrypt.hash("user123", 10),
          role: "user",
          department: "Informatique",
          createdAt: new Date()
        }
      ];
      console.log("Utilisateurs par défaut initialisés");
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des utilisateurs par défaut:", error);
    throw error;
  }
}

module.exports = { initializeDefaultUsers };
