#arret puis suppression de tous les containers
docker stop $(docker ps -qa)
docker rm $(docker ps -qa)

#on build les images depuis nos fichiers
docker build -t res/apache_php ../apache-php-image/ .
docker build -t res/apache-students-node ../express-image .
docker build -t res/apache-rp .

#lancement des images (avec port mapping pour le reverse proxy)
docker run -d --name apache_static res/apache_php
docker run -d --name express_dynamic res/express_students_node
docker run -p 8080:80 res/apache_rp