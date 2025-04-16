
import { apiRequest } from '../config/database';
import { User } from '@/data/models/User';

// Interface pour les réponses d'authentification
interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }) as AuthResponse;
      
      // Stocker le token d'authentification
      localStorage.setItem('token', data.token);
      
      return data.user;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  }

  static async register(username: string, password: string, department: string): Promise<User> {
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, department })
      }) as User;
      
      return data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem('token');
  }
}
