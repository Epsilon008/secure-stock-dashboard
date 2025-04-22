
const { initializeDefaultUsers } = require('./userInit');
const { findUserByUsername, findUserById, getAllUsers } = require('./userDB');
const { createUser, updateUser } = require('./userOperations');

// Initialize default users
if (!process.env.SKIP_INIT) {
  (async () => {
    try {
      await initializeDefaultUsers();
    } catch (error) {
      console.error("Error initializing default users:", error);
    }
  })();
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
  updateUser,
  getAllUsers,
  initializeDefaultUsers
};
