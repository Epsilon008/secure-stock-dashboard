
import { connectToDatabase, closeDatabaseConnection } from './config/database';

/**
 * Cette fonction initialise la connexion au backend Node.js
 */
export async function initializeDatabase() {
  try {
    console.log("Initialisation de la connexion au backend Node.js/Express");
    await connectToDatabase();
    
    console.log("Connexion au backend initialisée");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la connexion au backend:", error);
    throw error;
  }
}

// Fonction pour nettoyer la connexion lors de la fermeture de l'application
export async function cleanupDatabase() {
  try {
    await closeDatabaseConnection();
    console.log("Connexion au backend fermée");
  } catch (error) {
    console.error("Erreur lors de la fermeture de la connexion au backend:", error);
  }
}
