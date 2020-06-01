# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

IP de ma vm docker : 192.168.99.100

## Step 1: Static HTTP server with apache httpd

### Image Docker
L'image docker que j'ai utilisé est l'image officielle PHP :   
https://hub.docker.com/_/php/

Voici donc les lignes que j'ajoute au dockerfile : 
 ```dockerfile  
FROM php:7.2-apache
 
COPY src/ /var/www/html/
```

### Exploration de l'image
Je lance l'image avec :
* `docker run -d -p 8000:80 php:7.2-apache`  

Je peux utiliser `docker logs <nomducontainer>` pour vérifier que apache a démarré normalement. ( Le nom du container dans mon cas est serene_engelbart).

Maintenant j'utilise `docker exec -it serene_engelbart /bin/bash` pour lancer un terminal dans mon container.

Pour accéder à mon serveur depuis mon navigateur je me connecte à l'addresse `192.168.99.100:8000`.

### Ajout de contenu

* Je crée un fichier content dans notre image docker. 
Il faut donc éditer le dockerfile en changeant `/src` en `/content`.

* Maintenant il s'agit de build l'image docker : 
` docker build -t res/apache_php .`

*  Et enfin de la run avec la commande : 
`docker run -d -p 8000:80 res/apache_php .`

Comme dit dans la vidéo, on peut lancer plusieurs containers basés sur cette image, mais pour cela il faut changer le numéro de port utilisé pour le port-mapping de notre VM.

### Ajout d'un template
 
Template que j'ai utilisé :  
https://bootstrapmade.com/free-bootstrap-landing-page/

Rien de bien compliqué, unzip le download et copier le contenu du dossier dans notre fichier `content/`.

Il s'agit maintenant de rebuild l'image comme précédemment, puis ensuite de la Run.

J'ai modifié rapidement le template pour que l'on voit l'image de fond, et j'ai changé le texte d'acceuil et le texte du bouton.

Evidemment à chaque modification il faut rebuild l'image et relancer un nouveau container (si le dernier container n'est pas fermé, ne pas oublier d'utiliser un différent numéro de port).



