const mongoose = require('mongoose');  // Importation Mongoose pour pouvoir créer des modèles pour la base de données

// schéma de donnée pour une sauce
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },  // L'identifiant de l'utilisateur qui a créé la sauce (pour savoir à qui elle appartient)
    name: { type: String, required: true },  // Le nom de la sauce// Le nom de la sauce
    manufacturer: { type: String, required: true },  // Le fabricant de la sauce
    description: { type: String, required: true },  // Une description de la sauce
    mainPepper: { type: String, required: true },  // Le piment principal utilisé dans la sauce
    imageUrl: { type: String, required: true },  // Le lien vers l'image de la sauce (stockée sur le serveur)
    heat: { type: Number, required: true },  // Le niveau de piquant de la sauce (un chiffre)
    likes: { type: Number, required: true },  // Le nombre de personnes qui aiment la sauce
    dislikes: { type: Number, required: true },  // Le nombre de personnes qui n'aiment pas la sauce
    usersLiked: { type: [String], required: true },  // La liste des identifiants des utilisateurs qui ont liké la sauce
    usersDisliked: { type: [String], required: true },  // La liste des identifiants des utilisateurs qui n'ont pas aimé la sauce
   
});



// On crée le modèle 'Sauce' à partir du schéma, pour pouvoir l'utiliser 
// dans tout le projet et interagir avec les sauces dans la base de données
module.exports = mongoose.model('Sauce', sauceSchema);  