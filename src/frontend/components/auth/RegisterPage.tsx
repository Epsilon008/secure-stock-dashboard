
import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthService } from "@/backend/services/AuthService";
import { useAuth } from "@/frontend/context/AuthContext";

const departmentOptions = [
  "Ressources Humaines",
  "Informatique",
  "Finance",
  "Marketing",
  "Ventes",
  "Production",
  "Recherche et Développement",
  "Service Client",
  "Logistique",
  "Direction"
];

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (!department) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un département",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await AuthService.register(username, password, department);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      });
      
      navigate("/");
    } catch (error) {
      let errorMessage = "Une erreur inconnue s'est produite";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof Response) {
        try {
          const data = await error.json();
          errorMessage = data.message || errorMessage;
        } catch (_) {
          errorMessage = `Erreur ${error.status}: ${error.statusText}`;
        }
      }
      
      toast({
        title: "Échec de l'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">SecureStock</h1>
          <p className="text-muted-foreground mt-2">Gestion de stock sécurisée</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>
              Inscrivez-vous pour accéder à la plateforme
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select
                  value={department}
                  onValueChange={setDepartment}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Sélectionnez votre département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
              <div className="text-center mt-2">
                <p className="text-sm text-muted-foreground">
                  Déjà inscrit ?{" "}
                  <Link to="/" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
