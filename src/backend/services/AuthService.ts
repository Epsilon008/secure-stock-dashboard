
import { UserRepository } from "@/data/repositories/UserRepository";

interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  department?: string;
}

interface UserWithPassword extends User {
  password: string;
}

// Mock users for demonstration
const MOCK_USERS: UserWithPassword[] = [
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
  },
];

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      user => user.username === username && user.password === password
    );
    
    if (!foundUser) {
      return null;
    }
    
    // With registration enabled, we allow regular users to login now
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // In a real application, we would store the user in a database
    // and retrieve it from there using the UserRepository
    // UserRepository.saveUserSession(userWithoutPassword);
    
    return userWithoutPassword;
  }

  static async register(username: string, password: string, department: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username already exists
    const existingUser = MOCK_USERS.find(user => user.username === username);
    if (existingUser) {
      throw new Error("Ce nom d'utilisateur existe déjà");
    }
    
    // Create new user with a generated ID
    const newUser: UserWithPassword = {
      id: (MOCK_USERS.length + 1).toString(),
      username,
      password,
      role: "user", // New users are always regular users
      department,
    };
    
    // Add user to mock database
    MOCK_USERS.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static logout(): void {
    // In a real application, we would invalidate the user's session
    // UserRepository.removeUserSession();
  }
}
