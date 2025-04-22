
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { AuthService } from "@/backend/services/AuthService";
import { User } from "@/data/models/User";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateurs simulés pour le développement
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin" as const,
    department: "Direction"
  },
  {
    id: "2",
    username: "user",
    password: "user123",
    role: "user" as const,
    department: "Informatique"
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier la session existante au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mode développement - utiliser les utilisateurs simulés
      // Simuler un délai pour imiter une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = MOCK_USERS.find(
        user => user.username === username && user.password === password
      );
      
      if (!foundUser) {
        throw new Error("Identifiants invalides");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Stocker l'utilisateur dans localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      localStorage.setItem("token", "mock-token-for-development");
      
      setUser(userWithoutPassword);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${username}!`,
      });
      
      // Rediriger vers le tableau de bord
      navigate("/dashboard");
      
      /* 
      // NOTE: Pour utiliser le vrai backend en production, commentez le code ci-dessus et décommentez ceci:
      const authenticatedUser = await AuthService.login(username, password);
      if (!authenticatedUser) {
        throw new Error("Identifiants invalides");
      }
      setUser(authenticatedUser);
      navigate("/dashboard");
      */
    } catch (error) {
      toast({
        title: "Échec de la connexion",
        description: error instanceof Error ? error.message : "Une erreur inconnue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  const authValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
