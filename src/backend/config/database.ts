
// Configuration pour l'environnement de développement et production
// Utilise une API simulée en développement, et des vraies requêtes API en production

// Configuration de l'API URL de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fonction pour gérer les requêtes API
export const apiRequest = async (endpoint: string, options?: RequestInit) => {
  console.log(`API Request: ${endpoint}`, options);
  
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
