
/**
 * REMARQUE IMPORTANTE:
 * 
 * Ce fichier simule des opérations de base de données, mais il est configuré
 * pour communiquer avec un vrai backend Node.js/Express.
 * 
 * Le backend Node.js avec MongoDB est maintenant implémenté dans le dossier "backend".
 */

// L'URL de base de l'API 
export const API_URL = 'http://localhost:3001/api';

// Fonctions pour communiquer avec l'API Backend
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  const config = {
    ...options,
    headers
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  return await response.json();
}

// Fonctions maintenues pour la compatibilité avec le code existant
export async function connectToDatabase() {
  console.log("Connexion au backend Node.js via l'API REST");
  return {
    collection: () => ({}) // Cette fonction n'est plus utilisée directement
  };
}

export async function closeDatabaseConnection() {
  console.log("Déconnexion de l'API backend");
}

export const client = {
  connect: async () => { console.log("Connexion au client API"); },
  close: async () => { console.log("Déconnexion du client API"); },
  db: () => ({
    collection: () => ({}) // Cette fonction n'est plus utilisée directement
  })
};
