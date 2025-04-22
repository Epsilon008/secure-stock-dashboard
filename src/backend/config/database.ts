
// Ceci est une configuration simulée pour l'environnement de développement
// Dans un environnement de production, ce fichier se connecterait à une vraie base de données

// Simuler les requêtes API en utilisant le localStorage comme base de données
export const apiRequest = async (url: string, options?: RequestInit) => {
  console.log('API Request:', url, options);
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Extraire le chemin de l'URL (par exemple, '/auth/login')
  const endpoint = url.split('/').slice(1).join('/');
  
  // Traiter les différentes requêtes
  if (endpoint === 'auth/login') {
    const { username, password } = JSON.parse(options?.body as string);
    
    // Récupérer les utilisateurs du localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username);
    
    if (!user || user.password !== password) {
      throw new Error('Identifiants invalides');
    }
    
    // Créer un token simulé
    const token = `token_${Math.random().toString(36).substring(2)}`;
    
    // Retourner la réponse
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: token
    };
  }
  
  if (endpoint === 'auth/register') {
    const userData = JSON.parse(options?.body as string);
    
    // Récupérer les utilisateurs du localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérifier si l'utilisateur existe déjà
    if (users.some((u: any) => u.username === userData.username)) {
      throw new Error("Ce nom d'utilisateur existe déjà");
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
      id: (users.length + 1).toString(),
      username: userData.username,
      password: userData.password, // Note: Dans une vraie app, le mot de passe serait haché
      role: userData.role || 'user',
      department: userData.department,
      createdAt: new Date()
    };
    
    // Ajouter l'utilisateur à la liste
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  if (endpoint === 'users') {
    // Simuler la récupération de tous les utilisateurs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
  
  if (endpoint === 'users/profile') {
    // Pour simplifier, retourner le premier utilisateur comme profil
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      throw new Error("Aucun utilisateur trouvé");
    }
    const { password, ...userWithoutPassword } = users[0];
    return userWithoutPassword;
  }
  
  // Autres endpoints pourraient être ajoutés ici
  
  throw new Error(`Endpoint non implémenté: ${endpoint}`);
};
