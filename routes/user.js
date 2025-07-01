const express = require('express');  // Importation Express pour créer un routeur
const router = express.Router();  // Organiser les routes liées aux utilisateurs

const userCtrl = require('../controllers/user');  // Importation du contrôleur des utilisateurs (signup et login)

router.post('/signup', userCtrl.signup);  // Quand on reçoit une requête POST sur /api/auth/signup, on appelle la fonction signup du contrôleur
router.post('/login', userCtrl.login);  // Quand on reçoit une requête POST sur /api/auth/login, on appelle la fonction login du contrôleur

module.exports = router;  // Exportation du routeur pour l'utiliser dans l'application principale (app.js)