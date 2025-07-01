const multer = require('multer');  // Importation Multer, qui sert à gérer l'upload (envoi) de fichiers (ici, des images)

const MIME_TYPES = {  // Création d'un objet pour associer les types MIME des images à leur extension
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({  // Configuration du stockage des fichiers sur le disque
  destination: (req, file, callback) => {  // Indique le dossier où enregistrer les images
    callback(null, 'images');  // Les images seront stockées dans le dossier 'images'
  },
  filename: (req, file, callback) => {  // Définit le nom du fichier enregistré
    const name = file.originalname.split(' ').join('_');  // Enlève les espaces dans le nom d'origine et on les remplace par des _
    const extension = MIME_TYPES[file.mimetype];  // Récupère l'extension du fichier grâce à son type MIME
    callback(null, name + Date.now() + '.' + extension);  // Créer un nom unique : nom d'origine + timestamp + extension
  }
});

module.exports = multer({storage: storage}).single('image');  // Exporte la configuration de Multer : il va gérer un seul fichier à la fois, qui s'appelle 'image' dans le formulaire