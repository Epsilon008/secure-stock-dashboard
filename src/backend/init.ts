
import { connectToDatabase } from './config/database';
import { UserService } from './services/UserService';

export async function initializeDatabase() {
  try {
    await connectToDatabase();
    
    // Initialiser les utilisateurs par défaut
    await UserService.initializeDefaultUsers();
    
    console.log("Base de données initialisée avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
  }
}
