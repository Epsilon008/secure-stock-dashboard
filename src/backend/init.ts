
import { UserService } from './services/UserService';

/**
 * Cette fonction simule l'initialisation d'une base de données
 * Dans une implémentation réelle avec Node.js, cette fonction connecterait
 * à MongoDB et initialiserait les données nécessaires
 */
export async function initializeDatabase() {
  try {
    console.log("Simulation d'initialisation de base de données (en attente d'un backend Node.js)");
    await UserService.initializeDefaultUsers();
    
    console.log("Initialisation des données simulées terminée");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données simulées:", error);
    throw error;
  }
}
