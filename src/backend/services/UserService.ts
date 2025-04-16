
interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  department?: string;
}

interface UserWithPassword extends User {
  password: string;
}

// Référence aux mêmes utilisateurs simulés que dans AuthService
// Dans une implémentation réelle, cela viendrait de la base de données
const mockUsers: UserWithPassword[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    username: "user",
    password: "user123",
    role: "user",
    department: "Informatique",
  }
];

// Stockage local simulé
let users = [...mockUsers];

export class UserService {
  static async findUserByUsername(username: string): Promise<UserWithPassword | null> {
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = users.find(user => user.username === username);
      
      if (!user) {
        return null;
      }
      
      return { ...user };
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateur:", error);
      throw error;
    }
  }
  
  static async createUser(userData: Omit<UserWithPassword, 'id'>): Promise<User> {
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = users.find(user => user.username === userData.username);
      if (existingUser) {
        throw new Error("Ce nom d'utilisateur existe déjà");
      }
      
      // Créer un nouvel ID
      const id = String(users.length + 1);
      
      // Créer un nouvel utilisateur
      const newUser: UserWithPassword = {
        id,
        ...userData,
        createdAt: new Date()
      };
      
      // Ajouter l'utilisateur à notre liste simulée
      users.push(newUser);
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = newUser;
      
      return userWithoutPassword;
    } catch (error) {
      console.error("Erreur lors de la création d'utilisateur:", error);
      throw error;
    }
  }
  
  static async initializeDefaultUsers() {
    console.log("Initialisation des utilisateurs par défaut (simulée)");
    // Les utilisateurs par défaut sont déjà dans notre tableau mockUsers
    return true;
  }
}
