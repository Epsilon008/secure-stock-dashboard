
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './backend/init.ts';

// Initialiser la "base de données" simulée
initializeDatabase()
  .then(() => {
    console.log("Application prête à démarrer");
  })
  .catch(error => {
    console.error("Erreur lors de l'initialisation:", error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
