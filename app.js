//Pour pouvoir utiliser notre nouveau modèle Mongoose dans l'application, nous devons l'importer dans le fichier 
const mongoose = require('mongoose');  // On importe Mongoose, qui sert à connecter notre app à MongoDB et à gérer la base de données.
const path = require('path');  // On importe 'path', un outil pour gérer les chemins de fichiers (pratique pour les images).
const express = require('express');  // On importe Express, le framework qui facilite la création du serveur et des routes.
const bodyParser = require('body-parser');  // On importe body-parser, qui aide à lire les données envoyées dans les requêtes (par exemple, en JSON).
const app = express();  // On crée notre application Express, qui va gérer toutes les requêtes et réponses.
const sauceRoutes = require('./routes/sauce');  // On importe les routes liées aux sauces (ajouter, modifier, supprimer, etc.).
const userRoutes = require('./routes/user');  // On importe les routes liées aux utilisateurs (inscription, connexion, etc.).



// On se connecte à la base de données MongoDB grâce à Mongoose.
// Si la connexion réussit, on affiche un message de succès, sinon un message d’erreur.

mongoose.connect('mongodb+srv://jaja721:Maxou_721@cluster0.1lzy2pf.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // Ce middleware gère les autorisations d'accès depuis d'autres domaines
// Il permet à l’application frontend de communiquer avec le backend même si ce n’est pas le même domaine.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Autorise toutes les origines (tous les sites) à accéder à l’API.
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise certains headers dans les requêtes.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  // Autorise certaines méthodes HTTP.
  next();  // Passe au middleware suivant.
});

app.use(bodyParser.json());  // Ce middleware transforme le corps des requêtes en JSON, pour qu’on puisse facilement lire les données envoyées par le frontend.
app.use('/api/sauces', sauceRoutes);  // Toutes les routes qui commencent par /api/sauces utiliseront le fichier sauceRoutes (logique des sauces).
app.use('/api/auth', userRoutes);  // Toutes les routes qui commencent par /api/auth utiliseront le fichier userRoutes (logique des utilisateurs).
app.use('/images', express.static(path.join(__dirname, 'images')));  // Permet d’accéder aux images stockées dans le dossier 'images' via une URL.
app.use(express.json());  // Pareil que bodyParser.json(), ça permet de lire le JSON dans les requêtes (Express le fait maintenant sans body-parser).
module.exports = app;  // On exporte l’application pour pouvoir l’utiliser dans d’autres fichiers (comme dans server.js).
