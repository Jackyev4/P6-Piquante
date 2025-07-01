const mongoose = require('mongoose');  // Importation Mongoose pour créer des modèles pour la base de données
const uniqueValidator = require('mongoose-unique-validator');  // On importe un plugin qui va nous aider à vérifier que certains champs sont bien uniques exemple(email)


const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique:true },  // L'email de l'utilisateur. Il doit être présent (required) et unique
  password: { type: String, required: true } // Le mot de passe de l'utilisateur
});

userSchema.plugin(uniqueValidator);  // si quelqu'un essaie de s'inscrire avec un email déjà utilisé, la base de données renvoie une erreur

module.exports = mongoose.model('User', userSchema);  // On crée le modèle 'User' à partir du schéma, pour pouvoir l'utiliser dans tout le projet