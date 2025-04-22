
import { apiRequest } from '../config/database';
import { User, RegisterUserData } from '@/data/models/User';

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
      
      // Assurer que le rôle est correctement typé
      if (data.user && typeof data.user.role === 'string') {
        data.user.role = data.user.role === 'admin' ? 'admin' : 'user';
      }
      
      // Stocker l'utilisateur dans localStorage pour maintenir la session
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  }

  static async register(userData: RegisterUserData): Promise<User> {
    try {
      const newUser = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // Assurer que le rôle est correctement typé
      if (newUser && typeof newUser.role === 'string') {
        newUser.role = newUser.role === 'admin' ? 'admin' : 'user';
      }
      
      return newUser as User;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      const user = JSON.parse(userString) as User;
      // Assurer que le rôle est correctement typé
      if (user && typeof user.role === 'string') {
        user.role = user.role === 'admin' ? 'admin' : 'user';
      }
      return user;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  }
}
