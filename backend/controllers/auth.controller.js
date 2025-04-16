
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Le nom d\'utilisateur et le mot de passe sont requis' });
    }
    
    // Trouver l'utilisateur
    const user = await UserModel.findUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Créer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
}

async function register(req, res) {
  try {
    const { username, password, department } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Le nom d\'utilisateur et le mot de passe sont requis' });
    }
    
    // Créer l'utilisateur
    const newUser = await UserModel.createUser({
      username,
      password,
      department,
      role: 'user'
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "Ce nom d'utilisateur existe déjà") {
      return res.status(409).json({ message: error.message });
    }
    
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
}

module.exports = {
  login,
  register
};
