
import { UserRepository } from "@/data/repositories/UserRepository";

interface User {
  id: string;
  username: string;
  role: "admin" | "user";
}

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    username: "user",
    password: "user123",
    role: "user" as const,
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
    
    // Only allow admin login for now as specified in requirements
    if (foundUser.role !== "admin") {
      throw new Error("Regular user accounts are not available yet");
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // In a real application, we would store the user in a database
    // and retrieve it from there using the UserRepository
    // UserRepository.saveUserSession(userWithoutPassword);
    
    return userWithoutPassword;
  }

  static logout(): void {
    // In a real application, we would invalidate the user's session
    // UserRepository.removeUserSession();
  }
}
