
const { MongoClient } = require('mongodb');

// URI de connexion MongoDB - À remplacer avec votre URI réelle en production
// const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-app';
const uri = 'mongodb://localhost:27017/gestion-app'; // URI locale par défaut

let client = null;
let db = null;

// Pour le développement, on utilise une simulation mémoire
const inMemoryDB = {
  users: []
};

async function connectDB() {
  try {
    // COMMENTÉ POUR SIMULATION: Décommentez en production
    /*
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db();
      console.log('Connecté à MongoDB avec succès');
    }
    return { client, db };
    */
    
    // Simulation de connexion pour développement
    console.log('Utilisation de la simulation de base de données');
    return { client: null, db: inMemoryDB };
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    throw error;
  }
}

async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

async function closeDBConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Connexion MongoDB fermée');
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDBConnection,
  inMemoryDB
};
