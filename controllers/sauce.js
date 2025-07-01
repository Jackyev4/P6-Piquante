const Sauce = require('../models/sauce');  // Importation du modèle Sauce pour interagir avec la base de données
const fs = require('fs');  // Importation de fs pour pouvoir supprimer des fichiers (images) sur le serveur

//renvoi toutes les sauces présente dans la base de donnée
exports.getAllSauces = (req, res) => {
    Sauce.find()  // On cherche toutes les sauces
        .then(sauces => {
            res.status(200).json(sauces);  // Renvoie la liste des sauces si ok
        })
        .catch(error => {
            res.status(404).json({ error })  // Renvoie une erreur si la recherche échoue
        });
};

//renvoi une sauce présente dans la base de donnée selon l'ID de la sauce
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })  // Recherche une sauce par son id
        .then(sauce => {
            res.status(200).json(sauce);  // Renvoie la sauce si trouvée
        })
        .catch(error => res.status(404).json({ error }));  // Sinon, renvoie une erreur
};


exports.updateSauce = (req, res) => {
  // Si une nouvelle image est envoyée, on la prend en compte, sinon on garde les anciennes infos
  	
	const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),  // Récupère les infos de la sauce envoyées en JSON
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // Met à jour le lien de l'image
    } : { ...req.body };  // Sinon, on garde les infos déjà envoyées

   Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })  // Met à jour la sauce dans la base
        .then(res.status(200).json({ message: "Sauce modifiée" })) // Si ok, Message de succès
        .catch((error) => res.status(400).json({ error }))  // Sinon message d'erreur
};


//suppression d'une sauce
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })  // Recherche la sauce à supprimer
        .then((sauce) => {


            const fileName = sauce.imageUrl.split('/images/')[1];  // Récupère le nom du fichier image
            fs.unlink(`images/${fileName}`, () => {    // Supprime l'image du dossier images
                Sauce.deleteOne({ _id: req.params.id })  // Suppression de la sauce de la base
                    .then(() => res.status(200).json({ message: "La sauce a été supprimée !" }))  // Succès
                    .catch((error) => res.status(400).json({ error }));  // Erreur
            });

        })
        .catch((error) => res.status(400).json({ error }))  // Erreur
};

// Création d'une sauce par un utilisateur

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);  // Récupère les infos de la sauce envoyées en JSON dans la requête
    var filename = null;
    var sauce = null;
    if (!req.file) {  // Si aucune image n'a été envoyée avec la requête       
        filename = "tabasco.jpg";  // On utilise une image par défaut pour éviter une erreur
        sauce = new Sauce({
            ...sauceObject, // On copie toutes les infos de la sauce
            //name: req.body.name,
            //manufacturer: req.body.manufacturer,
            //description: req.body.description,
            //mainPepper: req.body.mainPepper,
            //heat: req.body.heat, 
            //userId : req.body.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/filename}`, // On utilise l'image par défaut
            likes: 0,  // Initialise le compteur de likes à 0
            dislikes: 0,  // Initialise le compteur de dislikes à 0
            usersLiked: [],  // Initialise la liste des utilisateurs ayant liké à vide
            usersDisliked: []  // Initialise la liste des utilisateurs ayant disliké à vide

        });
    }
    else { // Si une image a été envoyée avec la requête
        sauce = new Sauce({
            ...sauceObject,  // On copie toutes les infos de la sauce
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On utilise le nom du fichier uploadé
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []

        });
    }

    sauce.save()  //  Sauvegarde de la nouvelle sauce dans la base de données
        .then(() => res.status(200).json({ message: 'Sauce crée avec succès !' }))  // Si tout va bien, message de succès
        .catch(error => {  // Si le nom de la sauce n'est pas renseigné, on renvoie une erreur
              if (!req.body.name)
                 res.status(401).json({ message: 'Nom de la sauce non renseigné !' });  // Sinon, on demande de remplir tous les champs obligatoires du formulaire
            res.status(400).json({ message: 'Remplissez tous les champs requis dans le formulaire' })});  // Erreur 400 si des champs obligatoires sont manquants

} //fin du create sauce


    // Gestion des likes/dislikes d'une sauce
// like = 1 : user like
// like = 0 : user annule son like ou son dislike
// like = -1 : user dislike

exports.likeSauce = (req, res) => {
    const userId = req.body.userId;  // Récupération de l'id de l'utilisateur
    const sauceId = req.params.id;  // Récupération de l'id de la sauce
    const likeState = req.body.like;  // Récupération de l'état du like
   // console.log("likeState: " +likeState)
    switch (likeState) {
        //si like=1 on incrémente l'attribut likes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersLiked
        case 1:  // L'utilisateur aime la sauce
            Sauce.updateOne({ _id: sauceId }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })  // Ajoute un like et l'utilisateur dans usersLiked
                .then(() => res.status(200).json({ message: "Like ajouté à la sauce" }))
                .catch((error) => res.status(400).json({ error }));
            break;
        case 0:     //user annule son like ou son dislike
            Sauce.findOne({ _id: sauceId })
                .then(sauce => {
                    if (sauce.usersLiked.includes(userId)) {  //annule le like
                         Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })  // Enlève le like et l'utilisateur du tableau
                            .then(() => res.status(200).json({ message: "Vous avez enlever votre like !" }))
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(userId)) {  // Si l'utilisateur avait disliké
                        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })  // Enlève le dislike et l'utilisateur du tableau
                            .then(() => res.status(200).json({ message: "Vous avez enlever votre dislike !" }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(400).json({ error }));
            break;
            
        case -1: // l'utilisateur n'aime  pas la sauce (dislike)
            Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })  // Ajoute un dislike et l'utilisateur dans usersDisliked
                .then(() => res.status(200).json({ message: "dislike ajouté à la sauce" }))
                .catch((error) => res.status(400).json({ error }));
          
    }
}
