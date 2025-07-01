const jwt = require('jsonwebtoken');  // Importation du module JWT, qui sert à vérifier les tokens d'authentification

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // Récupération du token dans le header Authorization
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  // On vérifie et décode le token avec la clé secrète
    const userId = decodedToken.userId; // Extraction de l'ID de l'utilisateur depuis le token
    if (req.body.userId && req.body.userId !== userId) {  // Si un userId est envoyé dans la requête et qu'il ne correspond pas à celui du token
      throw 'Invalid user ID';  // Requête bloqué
    } else {
      next();  // Sinon, on laisse passer la requête
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')  // Si le token est invalide ou absent, on renvoie une erreur 401 (non autorisé)
    });
  }
};