
// Initialiser les données par défaut dans le localStorage pour l'environnement de développement

export const initializeDefaultData = () => {
  // Initialiser les utilisateurs par défaut s'ils n'existent pas déjà
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
      {
        id: "1",
        username: "admin",
        password: "admin123", // Dans une vraie app, les mots de passe seraient hachés
        role: "admin",
        department: "Direction",
        createdAt: new Date()
      },
      {
        id: "2",
        username: "user",
        password: "user123",
        role: "user",
        department: "Informatique",
        createdAt: new Date()
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    console.log("Utilisateurs par défaut initialisés");
  }
};

// Initialiser les données au démarrage de l'application
export const initApp = () => {
  console.log("Initialisation de l'application...");
  initializeDefaultData();
};
