
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { AuthService } from "@/backend/services/AuthService";

interface User {
  id: string;
  username: string;
  role: "admin" | "user";
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = AuthService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      const authenticatedUser = await AuthService.login(username, password);
      
      if (!authenticatedUser) {
        throw new Error("Identifiants invalides");
      }
      
      setUser(authenticatedUser);
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${username}!`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
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
    AuthService.logout();
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
