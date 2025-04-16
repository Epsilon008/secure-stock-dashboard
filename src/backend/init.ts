
import { UserService } from './services/UserService';

export async function initializeDatabase() {
  try {
    // Dans une implémentation simulée, nous n'avons pas besoin de connexion à la base de données
    // Nous initialisons simplement les utilisateurs par défaut
    await UserService.initializeDefaultUsers();
    
    console.log("Initialisation des données simulées terminée");
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données simulées:", error);
  }
}
