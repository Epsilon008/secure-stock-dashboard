
// Configuration pour l'environnement de développement et production
// Utilise une API simulée en développement, et des vraies requêtes API en production

// Configuration de l'API URL de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Variable pour activer/désactiver le mode simulation
const USE_MOCK_API = true; // Mettre à false pour utiliser le vrai backend

// Fonction pour gérer les requêtes API
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  console.log(`API Request: ${endpoint}`, options);
  
  if (USE_MOCK_API) {
    // Mode simulation - traitement local des requêtes
    console.log("Mode simulation activé - Pas de requête au serveur");
    return simulateApiResponse(endpoint, options);
  }
  
  try {
    // Construire l'URL complète
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Récupérer le token d'authentification du localStorage
    const token = localStorage.getItem('token');
    
    // Configuration par défaut des en-têtes
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers
    };
    
    // Ajouter le token d'authentification si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Créer la configuration complète de la requête
    const config: RequestInit = {
      ...options,
      headers
    };
    
    // Effectuer la requête
    const response = await fetch(url, config);
    
    // Si la réponse n'est pas ok (statut HTTP différent de 2xx)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Une erreur s\'est produite lors de la requête API');
    }
    
    // Analyser et retourner les données
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

// Simulation des réponses d'API pour le développement
function simulateApiResponse(endpoint: string, options?: RequestInit): Promise<any> {
  return new Promise((resolve, reject) => {
    // Simuler un délai réseau
    setTimeout(() => {
      // Traitement selon l'endpoint
      if (endpoint === '/auth/login' && options?.method === 'POST') {
        const requestBody = options.body ? JSON.parse(options.body as string) : {};
        const { username, password } = requestBody;
        
        // Vérifier les identifiants avec les utilisateurs simulés
        const mockUsers = [
          { id: "1", username: "admin", password: "admin123", role: "admin", department: "Direction" },
          { id: "2", username: "user", password: "user123", role: "user", department: "Informatique" }
        ];
        
        const user = mockUsers.find(u => u.username === username && u.password === password);
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({
            user: userWithoutPassword,
            token: "mock-jwt-token-for-development"
          });
        } else {
          reject(new Error("Identifiants invalides"));
        }
      } 
      else if (endpoint === '/auth/register' && options?.method === 'POST') {
        const requestBody = options.body ? JSON.parse(options.body as string) : {};
        const { username, password, department } = requestBody;
        
        // Simuler une création d'utilisateur
        const newUserId = Date.now().toString();
        const newUser = {
          id: newUserId,
          username,
          role: "user",
          department,
          createdAt: new Date().toISOString()
        };
        
        // Stocker l'utilisateur dans le localStorage pour simulation
        const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        existingUsers.push({ ...newUser, password });
        localStorage.setItem('mock_users', JSON.stringify(existingUsers));
        
        resolve(newUser);
      }
      else if (endpoint === '/users/profile' && options?.method === 'GET') {
        // Simuler la récupération du profil utilisateur
        const userJson = localStorage.getItem('user');
        if (userJson) {
          resolve(JSON.parse(userJson));
        } else {
          reject(new Error("Utilisateur non connecté"));
        }
      }
      else if (endpoint === '/users' && options?.method === 'GET') {
        // Récupérer tous les utilisateurs
        const mockUsers = [
          { id: "1", username: "admin", role: "admin", department: "Direction" },
          { id: "2", username: "user", role: "user", department: "Informatique" }
        ];
        
        // Ajouter les utilisateurs enregistrés localement
        const localUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const localUsersWithoutPasswords = localUsers.map((user: any) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        
        resolve([...mockUsers, ...localUsersWithoutPasswords]);
      }
      else {
        // Endpoint inconnu
        reject(new Error(`Endpoint non implémenté: ${endpoint}`));
      }
    }, 300); // Délai de 300ms pour simuler la latence réseau
  });
}
