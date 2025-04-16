
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './backend/init';

// Initialiser la base de données MongoDB
initializeDatabase()
  .then(() => {
    console.log("Initialisation de la base de données terminée");
  })
  .catch(error => {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
