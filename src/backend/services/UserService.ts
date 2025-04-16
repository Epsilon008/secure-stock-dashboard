
import { apiRequest } from '../config/database';
import { User } from '@/data/models/User';

export class UserService {
  static async findUserByUsername(username: string): Promise<User | null> {
    try {
      // Cette fonction n'a pas d'équivalent direct dans l'API,
      // mais nous pouvons l'implémenter comme ceci pour la compatibilité
      const users = await this.getAllUsers();
      return users.find(user => user.username === username) || null;
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateur:", error);
      throw error;
    }
  }
  
  static async createUser(userData: any): Promise<User> {
    try {
      return await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error("Erreur lors de la création d'utilisateur:", error);
      throw error;
    }
  }
  
  static async getUserProfile(): Promise<User> {
    try {
      return await apiRequest('/users/profile');
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      throw error;
    }
  }
  
  static async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      return await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  }
  
  static async getAllUsers(): Promise<User[]> {
    try {
      return await apiRequest('/users');
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
  }
  
  static async initializeDefaultUsers() {
    console.log("Les utilisateurs par défaut sont initialisés côté backend");
    return true;
  }
}
