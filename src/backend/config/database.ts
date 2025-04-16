
// Ce fichier est conservé pour la structure et pour une future implémentation réelle
// Actuellement, nous utilisons des données simulées car MongoDB ne fonctionne pas dans le navigateur

export async function connectToDatabase() {
  console.log("Connexion à la base de données simulée");
  return {
    collection: (name: string) => ({
      findOne: async () => null,
      insertOne: async () => ({ insertedId: "simulated-id" }),
      insertMany: async () => ({ insertedCount: 2 }),
      countDocuments: async () => 0
    })
  };
}

export async function closeDatabaseConnection() {
  console.log("Fermeture de la connexion à la base de données simulée");
}

export const client = {
  connect: async () => {},
  close: async () => {},
  db: () => ({
    collection: (name: string) => ({
      findOne: async () => null,
      insertOne: async () => ({ insertedId: "simulated-id" }),
      insertMany: async () => ({ insertedCount: 2 }),
      countDocuments: async () => 0
    })
  })
};
