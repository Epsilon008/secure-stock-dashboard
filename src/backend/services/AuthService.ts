
interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  department?: string;
}

interface UserWithPassword extends User {
  password: string;
}

// Utilisateurs simulés pour la démonstration
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

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Rechercher l'utilisateur
      const foundUser = users.find(user => 
        user.username === username && user.password === password
      );
      
      if (!foundUser) {
        return null;
      }
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = foundUser;
      
      return userWithoutPassword;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  }

  static async register(username: string, password: string, department: string): Promise<User> {
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        throw new Error("Ce nom d'utilisateur existe déjà");
      }
      
      // Créer un nouvel ID
      const id = String(users.length + 1);
      
      // Créer un nouvel utilisateur
      const newUser: UserWithPassword = {
        id,
        username,
        password,
        role: "user",
        department
      };
      
      // Ajouter l'utilisateur à notre liste simulée
      users.push(newUser);
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = newUser;
      
      return userWithoutPassword;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  }

  static logout(): void {
    // Dans une application réelle, nous invaliderions la session de l'utilisateur
  }
}
