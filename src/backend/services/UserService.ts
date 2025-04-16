
import { connectToDatabase } from '../config/database';
import { ObjectId } from 'mongodb';

interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  department?: string;
}

interface UserWithPassword extends User {
  password: string;
}

export class UserService {
  static async findUserByUsername(username: string): Promise<UserWithPassword | null> {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('users');
      const user = await collection.findOne({ username });
      
      if (!user) {
        return null;
      }
      
      return {
        id: user._id.toString(),
        username: user.username,
        password: user.password,
        role: user.role,
        department: user.department,
      };
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateur:", error);
      throw error;
    }
  }
  
  static async createUser(userData: Omit<UserWithPassword, 'id'>): Promise<User> {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('users');
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await collection.findOne({ username: userData.username });
      if (existingUser) {
        throw new Error("Ce nom d'utilisateur existe déjà");
      }
      
      // Insérer le nouvel utilisateur
      const result = await collection.insertOne({
        username: userData.username,
        password: userData.password, // Dans une application réelle, ce mot de passe devrait être hashé
        role: userData.role,
        department: userData.department,
        createdAt: new Date()
      });
      
      // Retourner l'utilisateur sans le mot de passe
      return {
        id: result.insertedId.toString(),
        username: userData.username,
        role: userData.role,
        department: userData.department
      };
    } catch (error) {
      console.error("Erreur lors de la création d'utilisateur:", error);
      throw error;
    }
  }
  
  static async initializeDefaultUsers() {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('users');
      
      // Vérifier si la collection est vide
      const count = await collection.countDocuments();
      if (count === 0) {
        // Insérer les utilisateurs par défaut
        await collection.insertMany([
          {
            username: "admin",
            password: "admin123", // Dans une application réelle, ce mot de passe devrait être hashé
            role: "admin",
            createdAt: new Date()
          },
          {
            username: "user",
            password: "user123",
            role: "user",
            department: "Informatique",
            createdAt: new Date()
          }
        ]);
        console.log("Utilisateurs par défaut créés");
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des utilisateurs:", error);
    }
  }
}
