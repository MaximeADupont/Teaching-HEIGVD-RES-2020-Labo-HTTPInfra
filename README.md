# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

IP de ma vm docker : 192.168.99.100

#### Remarque
J'ai laissé les nodes_modules dans le git pour m'assurer du bon fonctionnement du serveur (par manque de familiarité avec node.js je ne sais pas quels fichiers je peux ignorer).

## Step 3: Reverse proxy with apache (static configuration)

On lance des containers avec les images créées précédemment et je leur donne un nom pour qu'elle soient plus faciles d'accès :  
`docker run -d --name apache_static res/apache_php`  
`docker run -d --name express_dynamic res/express_students_node`

Il s'agit maintenant d'obtenir l'ip des deux containers avec les commandes :  
* `docker inspect apache_static | grep -i ipaddress` qui nous donne comme IP : *172.17.0.2*
* `docker inspect express_dynamic | grep -i ipaddress` qui nous donne comme IP : *172.17.0.3*

On run maintenant un container en mode interactif :  
`docker run -p 8080:80 -it php:7.2-apache /bin/bash `  

Dans cet invité de commande on se deplace vers les configs : 
`cd /etc/apache2/sites-available`

On copie la config par defaut dans un nouveau fichier :
`cp 000-default.conf 001-reverse-proxy.conf`

On installe le nécessaire pour éditer le fichier :
`apt-get update` puis `apt-get install vim`

On édite le fichier que l'on vient de créer : 
``` 
<VirtualHost *:80>
        ServerName demo.res.ch                                                                                                                                                                                                                          
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        ProxyPass "/api/locations/" "http://172.17.0.3:3000/"
        ProxyPassReverse "/api/locatoins/" "http://172.17.0.3:3000/"

        ProxyPass "/" "http://172.17.0.2:80"
        ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>                                                                     
``` 

Il faut maintenant activer le nouveau site : 
`a2ensite 001*` (on utilise un wildcard pour ne pas taper tout le nom du site puisqu'il y a simplement un seul site dont le nom commence par 001).

On nous demande alors de lancer `service apache2 reload` pour activer ce changement.

Il faut activer différent module pour que cela fonctionne :
* `a2enmod proxy`
* `a2enmod proxy_http`

Puis nous devons restart apache2 ( `service apache2 restart`).

### Set up de l'image docker

On crée le dockerfile :
```dockerfile
FROM php:7.2-apache

COPY conf/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
```

On crée un directory conf contenant un deuxieme directory sites_available qui contient : 
* 000-default.conf :
```
<VirtualHost *:80>
</VirtualHost>
```

* 001-reverse-proxy.conf :

```
<VirtualHost *:80>
        ServerName demo.res.ch                                                                                                                                                                                                                          
        #ErrorLog ${APACHE_LOG_DIR}/error.log
        #CustomLog ${APACHE_LOG_DIR}/access.log combined

        ProxyPass "/api/locations/" "http://172.17.0.3:3000/"
        ProxyPassReverse "/api/locatoins/" "http://172.17.0.3:3000/"

        ProxyPass "/" "http://172.17.0.2:80"
        ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>  
```

Maintenant il s'agit de build l'image : 
`docker build -t res/apache_rp .`

Nous pouvons maintenant la run :
`docker run -p 8080:80 res/apache_rp`

Sous windows, j'ai modifié le fichier `C:\Windows\System32\drivers\etc\hosts` avec les privilèges admin pour pouvoir accéder au site depuis mon navigateur. J'ai ajouté la ligne `192.168.99.100 demo.res.ch`.

> You can explain and prove that the static and dynamic servers cannot be reached directly (reverse proxy is a single entry point in the infra).

Puisque nous n'avons pas port mappé les containers docker, le seul moyen d'y accéder est le reverse proxy

> You are able to explain why the static configuration is fragile and needs to be improved.

Tout simplement parce que l'IP des containers docker est hardcodée, donc si pour une raison X ou Y lorsque l'on relance ces containers l'addresse change, alors plus rien ne fonctionne.

### Problème connu : 
Je n'arrive pas à expliquer pourquoi, mais lorsque j'essaye d'envoyer une requete à mes containers via telnet, elle ne passe pas. Tout fonctionne normalement via mon navigateur cependant.