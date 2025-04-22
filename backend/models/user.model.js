
const { getDB, inMemoryDB } = require('../config/db');
const bcrypt = require('bcrypt');

const COLLECTION_NAME = 'users';

// Initialiser les utilisateurs par défaut pour la simulation
if (!inMemoryDB.users || inMemoryDB.users.length === 0) {
  inMemoryDB.users = [];
  
  // Utilisateurs par défaut à ajouter en mode simulation
  (async () => {
    await initializeDefaultUsers();
  })();
}

async function findUserByUsername(username) {
  try {
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    const db = await getDB();
    return db.collection(COLLECTION_NAME).findOne({ username });
    */
    
    // Version simulation
    const db = await getDB();
    return db.users.find(user => user.username === username);
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateur:", error);
    throw error;
  }
}

async function findUserById(id) {
  try {
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    const db = await getDB();
    return db.collection(COLLECTION_NAME).findOne({ id });
    */
    
    // Version simulation
    const db = await getDB();
    return db.users.find(user => user.id === id);
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateur par ID:", error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await findUserByUsername(userData.username);
    if (existingUser) {
      throw new Error("Ce nom d'utilisateur existe déjà");
    }
    
    // Générer un ID unique
    const db = await getDB();
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    const countUsers = await db.collection(COLLECTION_NAME).countDocuments();
    const id = String(countUsers + 1);
    */
    
    // Version simulation
    const countUsers = db.users.length;
    const id = String(countUsers + 1);
    
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Créer l'utilisateur
    const newUser = {
      id,
      username: userData.username,
      password: hashedPassword,
      role: userData.role || 'user',
      department: userData.department,
      createdAt: new Date()
    };
    
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    await db.collection(COLLECTION_NAME).insertOne(newUser);
    */
    
    // Version simulation
    db.users.push(newUser);
    
    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur:", error);
    throw error;
  }
}

async function updateUser(id, userData) {
  try {
    // Filtrer les champs à mettre à jour
    const updateData = {};
    if (userData.username) updateData.username = userData.username;
    if (userData.department) updateData.department = userData.department;
    if (userData.role) updateData.role = userData.role;
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }
    
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    const db = await getDB();
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      throw new Error("Utilisateur non trouvé ou aucune modification effectuée");
    }
    */
    
    // Version simulation
    const db = await getDB();
    const userIndex = db.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }
    
    // Mettre à jour l'utilisateur
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

async function getAllUsers() {
  try {
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    const db = await getDB();
    const users = await db.collection(COLLECTION_NAME).find({}).toArray();
    */
    
    // Version simulation
    const db = await getDB();
    const users = [...db.users];
    
    // Retirer les mots de passe
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
}

async function initializeDefaultUsers() {
  try {
    const db = await getDB();
    
    // COMMENTÉ POUR SIMULATION: En production, utilisez ceci
    /*
    const count = await db.collection(COLLECTION_NAME).countDocuments();
    
    // N'initialiser que si aucun utilisateur n'existe
    if (count === 0) {
      const defaultUsers = [
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
      
      await db.collection(COLLECTION_NAME).insertMany(defaultUsers);
      console.log("Utilisateurs par défaut initialisés");
    }
    */
    
    // Version simulation
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

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
  updateUser,
  getAllUsers,
  initializeDefaultUsers
};
