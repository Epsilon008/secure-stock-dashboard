
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
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // Assurer que le rôle est soit "admin" soit "user"
      if (typeof response === 'object' && 'role' in response) {
        response.role = response.role === 'admin' ? 'admin' : 'user';
      }
      
      return response as User;
    } catch (error) {
      console.error("Erreur lors de la création d'utilisateur:", error);
      throw error;
    }
  }
  
  static async getUserProfile(): Promise<User> {
    try {
      const response = await apiRequest('/users/profile');
      
      // Assurer que le rôle est soit "admin" soit "user"
      if (typeof response === 'object' && 'role' in response) {
        response.role = response.role === 'admin' ? 'admin' : 'user';
      }
      
      return response as User;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      throw error;
    }
  }
  
  static async updateUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
      
      // Assurer que le rôle est soit "admin" soit "user"
      if (typeof response === 'object' && 'role' in response) {
        response.role = response.role === 'admin' ? 'admin' : 'user';
      }
      
      return response as User;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  }
  
  static async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiRequest('/users');
      
      // Assurer que la réponse est un tableau d'utilisateurs
      if (Array.isArray(response)) {
        // Assurer que chaque utilisateur a un rôle valide
        return response.map(user => ({
          ...user,
          role: user.role === 'admin' ? 'admin' : 'user'
        })) as User[];
      }
      
      return [] as User[];
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
