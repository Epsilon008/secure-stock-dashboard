
// Initialiser les données par défaut dans le localStorage pour l'environnement de développement
// Cette fonction n'est utile que pour le développement, elle sera remplacée par MongoDB en production

export const initializeDefaultData = () => {
  // Cette fonction n'est plus nécessaire car nous utilisons un vrai backend
  console.log("Utilisation du backend pour l'initialisation des données");
};

// Initialiser les données au démarrage de l'application
export const initApp = () => {
  console.log("Initialisation de l'application...");
  // En développement avec backend simulé, c'est utile
  // En production avec un vrai backend MongoDB, cette fonction ne fait rien
  initializeDefaultData();
};
