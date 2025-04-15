
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

const Settings: React.FC = () => {
  const [appName, setAppName] = useState("SecureStock");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#f8fafc");
  const [accentColor, setAccentColor] = useState("#10b981");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSaveAppearance = () => {
    // In a real app, this would save the settings to a backend
    // For now, we'll just show a toast
    toast({
      title: "Paramètres d'apparence enregistrés",
      description: "Les modifications ont été appliquées avec succès.",
    });
  };

  const handleResetAppearance = () => {
    setPrimaryColor("#3b82f6");
    setSecondaryColor("#f8fafc");
    setAccentColor("#10b981");
    
    toast({
      title: "Paramètres réinitialisés",
      description: "Les couleurs ont été réinitialisées aux valeurs par défaut.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="appearance">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo et Nom de l'Application</CardTitle>
              <CardDescription>
                Personnalisez le logo et le nom de votre application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">Nom de l'application</Label>
                <Input
                  id="appName"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo de l'application</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 border rounded flex items-center justify-center bg-card overflow-hidden">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs text-center">
                        Pas de logo
                      </span>
                    )}
                  </div>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => {
                  toast({
                    title: "Paramètres enregistrés",
                    description: "Le nom et le logo ont été mis à jour.",
                  });
                }}>
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Couleurs du Thème</CardTitle>
              <CardDescription>
                Personnalisez les couleurs de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Couleur d'accent</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded border"
                      style={{ backgroundColor: accentColor }}
                    />
                    <Input
                      id="accentColor"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleResetAppearance}>
                  Réinitialiser
                </Button>
                <Button onClick={handleSaveAppearance}>
                  Appliquer les changements
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Compte</CardTitle>
              <CardDescription>
                Gérez les informations de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value="admin@securestock.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Entrez votre mot de passe actuel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Entrez un nouveau mot de passe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={() => {
                  toast({
                    title: "Mot de passe non modifié",
                    description: "Cette fonctionnalité n'est pas disponible dans cette démo.",
                    variant: "destructive",
                  });
                }}>
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
              <CardDescription>
                Configurez quand et comment vous recevez des notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground py-8 text-center">
                Les préférences de notification seront disponibles dans une version future.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
