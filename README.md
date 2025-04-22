
# Application de Gestion Opérationnelle

Cette application est une solution de gestion opérationnelle avec authentification et gestion des utilisateurs.

## Fonctionnalités

- Authentification (connexion/inscription)
- Gestion des utilisateurs
- Tableau de bord
- Gestion des employés
- Gestion des stocks
- Paramètres

## Structure du projet

- `src/` - Code source frontend (React, TypeScript)
- `backend/` - Code source backend (Node.js, Express)

## Installation

1. Cloner le dépôt
2. Installer les dépendances

```bash
# Installation frontend
npm install

# Installation backend
cd backend
npm install
```

## Configuration

1. Créer un fichier `.env` à la racine du projet backend avec le contenu suivant:

```
PORT=3001
JWT_SECRET=votre_cle_secrete_jwt_a_changer_en_production
MONGODB_URI=mongodb://localhost:27017/gestion-app
```

2. Créer un fichier `.env` à la racine du projet frontend avec:

```
VITE_API_URL=http://localhost:3001/api
```

## Démarrage en développement

1. Démarrer le backend:

```bash
cd backend
npm run dev
```

2. Démarrer le frontend:

```bash
npm run dev
```

## Connexion à MongoDB en production

Pour connecter l'application à MongoDB en production:

1. Obtenez une URL de connexion MongoDB (Atlas ou serveur MongoDB hébergé)
2. Décommentez la partie de connexion MongoDB dans `backend/config/db.js`
3. Remplacez la valeur de `MONGODB_URI` dans le fichier `.env` du backend

## Comptes par défaut

- Admin: `admin / admin123`
- Utilisateur: `user / user123`

## Déploiement en production

Pour le déploiement en production:

1. Construire le frontend: `npm run build`
2. Configurer les variables d'environnement sur votre serveur
3. Démarrer le backend: `npm start` dans le dossier backend
4. Servir les fichiers statiques du frontend avec un serveur web (Nginx, Apache, etc.)

## Sécurité

Pour une utilisation en production:

1. Générez une clé JWT forte et unique
2. Utilisez HTTPS
3. Mettez en place des mesures de sécurité supplémentaires (rate limiting, etc.)
4. Utilisez un service MongoDB sécurisé avec authentification
