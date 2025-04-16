
# Backend Node.js pour l'Application de Gestion

Ce backend fournit les API nécessaires pour l'application de gestion.

## Configuration requise
- Node.js (v14 ou supérieur)
- MongoDB (v4 ou supérieur)

## Installation

1. Installer les dépendances :
```
npm install
```

2. Configurer les variables d'environnement :
Créez un fichier `.env` à la racine avec les variables suivantes :
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gestion
JWT_SECRET=votre_secret_jwt_super_securise_a_changer
```

3. Démarrer le serveur :
```
npm start
```
Pour le développement, utilisez :
```
npm run dev
```

## Endpoints API

### Authentification
- POST /api/auth/login - Connexion utilisateur
- POST /api/auth/register - Inscription nouvel utilisateur

### Utilisateurs
- GET /api/users/profile - Obtenir le profil de l'utilisateur connecté
- PUT /api/users/profile - Mettre à jour le profil utilisateur
- GET /api/users - Obtenir tous les utilisateurs (admin uniquement)

## Modèles de données

### Utilisateur
```json
{
  "id": "string",
  "username": "string",
  "password": "string (hashed)",
  "role": "admin | user",
  "department": "string (optional)",
  "createdAt": "Date"
}
```

## Sécurité
- Authentification par JWT (JSON Web Tokens)
- Middleware de vérification des rôles pour les routes protégées
- Hachage des mots de passe avec bcrypt
