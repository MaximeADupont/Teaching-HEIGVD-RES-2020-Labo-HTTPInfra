# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

IP de ma vm docker : 192.168.99.100

#### Remarque
J'ai laissé les nodes_modules dans le git pour m'assurer du bon fonctionnement du serveur (par manque de familiarité avec node.js je ne sais pas quels fichiers je peux ignorer).

## Step 2: Dynamic HTTP server with express.js

### Node
J'utilise la version 12.17 de node, on peut voir sur : https://nodejs.org/en/ que c'est la dernière version stable.

Contenu du Dockerfile :
```dockerfile
FROM node:12.17

COPY src /opt/app

CMD ["node", "/opt/app/index.js"]
```

Puisque que l'on copie le contenu de src dans notre image, on crée le dossier `/src`. 
Une fois dans ce dossier :
* On lance la commande `npm init`.
* Simplement remplir les champs comme montré dans la vidéo.
* On installe le module `chance`
    * `npm install --save chance`
* On crée le fichier `index.js` et on le remplit avec :
```js
var Chance = require('Chance');
var chance = new Chance();

console.log("Bonjour " + chance.name());
```
* En tapant la commande `node index.js` on peut voir que cela fonctionne correctement et que l'affichage est bien "Bonjour + <nom_aléatoire>"

* Il s'agit maintenant de build l'image voulue : `docker build -t res/express_students_node .`

* Enfin il est temps de run notre image : `docker run res/express_students`

On peut alors voir que notre application fonctionne pour l'instant

### Express

* `npm install --save express` même fonctionnement que pour le module chance, dans le fichier src.

* On utilise la même base qu'avant en modifiant index.js pour que son contenu devienne :
```js
var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/test', function(req,res){
	res.send("Say hello to my little test");
});

app.get('/', function(req, res){
	res.send("Hello RES");
});

app.listen(3000, function(){
	console.log('Accepting HTTP requests on port 3000.');
});
```

* Après ces quelques tests je modifie `index.js` afin d'avoir une application similaire à la vidéo : 
```js
var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/test', function(req,res){
	res.send("Say hello to my little test");
});

app.get('/', function(req, res){
	res.send( generateLocations());
});

app.listen(3000, function(){
	console.log('Accepting HTTP requests on port 3000.');
});

//quick function that generates a random location : random city in random state in random country
function generateLocations(){
	var numberOfLocations = chance.integer({min: 0, max: 10});
	console.log("Creating " + numberOfLocations + " random locations ...");
	var locations = [];
	for(var i = 0; i < numberOfLocations; ++i){
		var city = chance.city();
		var state = chance.state({full: true});
		var country = chance.country({full: true});
		locations.push({
			city: city,
			state: state,
			country: country
		});
	}
	console.log(locations);
	return locations;
}
```

* Maintenant je suis prêt à build mon image docker :  
`docker build -t res/express_students_node .`

* Enfin il s'agit de la lancer notre image : 
`docker run -p 8000:3000 res/express_students_node`. Je peux donc accéder à mon serveur à l'addresse 192.168.99.100(:8000) via mon navigateur pour obtenir des endroits aléatoires.

