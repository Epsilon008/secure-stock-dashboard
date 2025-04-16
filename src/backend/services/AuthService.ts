
import { UserService } from "./UserService";
import { connectToDatabase } from '../config/database';

interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  department?: string;
}

interface UserWithPassword extends User {
  password: string;
}

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      // Chercher l'utilisateur dans MongoDB
      const foundUser = await UserService.findUserByUsername(username);
      
      if (!foundUser || foundUser.password !== password) {
        return null;
      }
      
      // Avec l'inscription activée, nous permettons aux utilisateurs réguliers de se connecter maintenant
      const { password: _, ...userWithoutPassword } = foundUser;
      
      return userWithoutPassword;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  }

  static async register(username: string, password: string, department: string): Promise<User> {
    try {
      // Créer un nouvel utilisateur dans MongoDB
      const newUser = await UserService.createUser({
        username,
        password,
        role: "user", // Les nouveaux utilisateurs sont toujours des utilisateurs réguliers
        department
      });
      
      return newUser;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  }

  static logout(): void {
    // Dans une application réelle, nous invaliderions la session de l'utilisateur
  }
}
