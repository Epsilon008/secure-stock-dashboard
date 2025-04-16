
import { MongoClient, ServerApiVersion } from 'mongodb';

// Remplacer par votre URI de connexion MongoDB
const uri = "mongodb://localhost:27017";

// Créez un MongoClient avec une configuration MongoClientOptions pour définir la version stable de l'API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    // Connecter le client au serveur
    await client.connect();
    console.log("Connecté à MongoDB");
    return client.db("securestock");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log("Connexion à MongoDB fermée");
  } catch (error) {
    console.error("Erreur lors de la fermeture de la connexion MongoDB:", error);
  }
}

export { client };
