const http= require('http');  // On importe le module 'http' de Node.js pour pouvoir créer un serveur web.
const app = require('./app')  // On importe notre application Express (tout le code de nos routes, middlewares, etc.).

app.set('port',process.env.PORT||3000);  // On définit sur quel port notre application va écouter. 


const server = http.createServer(app);  // On crée le serveur HTTP en utilisant notre application Express comme "gestionnaire" des requêtes.

server.listen(process.env.PORT||3000);  // On démarre le serveur et on lui dit d'écouter sur le port choisi plus haut 
