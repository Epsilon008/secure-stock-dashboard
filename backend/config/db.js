
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client = null;
let db = null;

async function connectDB() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db();
      console.log('Connecté à MongoDB avec succès');
    }
    return { client, db };
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
  closeDBConnection
};
