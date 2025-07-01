const bcrypt = require ('bcrypt');  // Importation de bcrypt pour hacher (crypter) les mots de passe
const User = require('../models/user');  // Importation du modèle User pour interagir avec la base de données
const jwt = require('jsonwebtoken');  //  Importation jsonwebtoken pour créer des tokens d'authentification


// Fonction pour l'inscription d'un utilisateur (Sign up)

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)  //  force 10 pour le cryptage fonction asynchrone qui renvoie une Promise avec le hash généré 
    .then(hash => {
      const user = new User({  // Crée un nouvel objet utilisateur
        email: req.body.email,  // Récupère l'email envoyé dans la requête
        password: hash         // Utilise le mot de passe haché
      });       
      user.save()
        .then(() => res.status(200).json({ message: 'Utilisateur créé !' }))  // Message de succès
        .catch(error => res.status(400).json({ message:'Utilisateur déjà existant'})); // Déjà existant
    })
    .catch(error => {
        if (!req.body.email) {   
            res.status(401).json({ message: 'email non renseigne !' });
            return; 
        } 
        if (!req.body.password)
            res.status(401).json({ message: 'password non renseigne !' });

     })
};


// Fonction pour la connexion d'un utilisateur (Login)
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })  // Chercher l'utilisateur par son email
    .then(user => {
      if (!user) {  // Si l'utilisateur n'existe pas, erreur
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)  // Comparaison du mot de passe fourni avec celui de la base
        .then(valid => {
          if (!valid) {  // Si le mot de passe est incorrect, erreur
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({  // Si tout est bon, renvoi de l'ID de l'utilisateur et un token JWT
            userId: user._id,
            token: jwt.sign(  // Création d'un token qui contient l'ID de l'utilisateur et expire dans 24h
              { userId: user._id },
              'RANDOM_TOKEN_SECRET', // Clé secrète pour signer le token
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));  // (erreur serveur 500)
    })
    .catch(error => res.status(500).json({ error }));  // (erreur serveur 500)
};