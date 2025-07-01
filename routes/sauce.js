const express = require('express'); // Importation Express
const router = express.Router();  // Créer router pour organiser toutes les routes qui concernent les sauces
const auth = require('../middleware/auth');  // On importe le middleware d'authentification, pour vérifier que l'utilisateur est bien connecté avant certaines actions
const multer = require('../middleware/multer-config');  // On importe le middleware Multer, qui sert à gérer l'envoi et le stockage des images
const sauceCtrl = require('../controllers/sauce');  // On importe le controller des sauces, qui contient toute la logique pour créer, modifier, supprimer, etc



router.get('/', sauceCtrl.getAllSauces);  // Quand on fait GET sur /api/sauces, on appelle la fonction qui retourne toutes les sauces
router.get('/:id', sauceCtrl.getOneSauce);  // Quand on fait GET sur /api/sauces/:id, on récupère une sauce précise grâce à son id
router.put('/:id', auth,multer,sauceCtrl.updateSauce);  // Vérification connexion utilisateur, modification sauce, gestion de l'image
router.delete('/:id',auth, sauceCtrl.deleteSauce);  // Vérification connexion utilisateur, puis suppression d'un sauce
router.post('/',auth, multer, sauceCtrl.createSauce);  // Vérification connexion utilisateur, gestion de l'image puis création de la sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);  // Vérification connexion utilisateur puis Like ou Dislike 
module.exports = router;  // Export du router pour l'utiliser dans l'application principale