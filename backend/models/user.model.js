
const { getDB } = require('../config/db');
const bcrypt = require('bcrypt');

const COLLECTION_NAME = 'users';

async function findUserByUsername(username) {
  const db = await getDB();
  return db.collection(COLLECTION_NAME).findOne({ username });
}

async function findUserById(id) {
  const db = await getDB();
  return db.collection(COLLECTION_NAME).findOne({ id });
}

async function createUser(userData) {
  const db = await getDB();
  
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await findUserByUsername(userData.username);
  if (existingUser) {
    throw new Error("Ce nom d'utilisateur existe déjà");
  }
  
  // Générer un ID unique (simple pour l'exemple)
  const countUsers = await db.collection(COLLECTION_NAME).countDocuments();
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
  
  await db.collection(COLLECTION_NAME).insertOne(newUser);
  
  // Retourner l'utilisateur sans le mot de passe
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

async function updateUser(id, userData) {
  const db = await getDB();
  
  // Filtrer les champs à mettre à jour
  const updateData = {};
  if (userData.username) updateData.username = userData.username;
  if (userData.department) updateData.department = userData.department;
  if (userData.role) updateData.role = userData.role;
  if (userData.password) {
    updateData.password = await bcrypt.hash(userData.password, 10);
  }
  
  const result = await db.collection(COLLECTION_NAME).updateOne(
    { id },
    { $set: updateData }
  );
  
  if (result.modifiedCount === 0) {
    throw new Error("Utilisateur non trouvé ou aucune modification effectuée");
  }
  
  return await findUserById(id);
}

async function initializeDefaultUsers() {
  const db = await getDB();
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
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
  updateUser,
  initializeDefaultUsers
};
