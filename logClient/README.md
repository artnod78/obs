# Death Count
Il s'agit d'un petit overlay qui affiche le nombre de morts.  
* Scan le fichier de log
* Incrémente une valeur en base de donnée lorsqu'il détecte la mort d'un joueur
* Chaque monde démarré à son nombre de mort.

Il est impossible de savoir via les log combien de fois est mort un joueur. Mais la mort d'un joueur est détectable.  
L'overlay ne fait qu'incrementer une valeur lorsqu'un joueur mort.  
A l'heure actuelle, il est impossible de savoir le nombre de mort qu'il y a eu avant que l'overlay soit lancé.  
Ainsi que le nombre de mort lorsque l'overlay n'est pas lancé.  

## Installation
Dans cette partie nous verrons les différentes étapes afin de pourvoir utiliser l'overlay.  

### Le projet
Il s'agit de ce projet, des overlays pour 7 Days to Die.
#### Télechargement
Télecharger le zip du projet à cette adresse: [ici](https://github.com/artnod78/obs/archive/master.zip).  
Décompresser le zip. Puis copier le dossier **logClient** là où vous voulez. par exemple dans `D:\` afin d'avoir le dossier `D:\logClient`.  
#### Configuration
Il va falloir modifier un fichier afin de lui renseigner le dossier du jeu.
Allez dans `D:\logClient\api`. Puis *clic droit > modifier* sur le fichier **api.php**.  
Editer la ligne **2** afin que le chemin corresponde avec celui du jeu.  
Le chemin doit finir par un slash ( **/** ).  

`$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';` 

### WAMP
WampServer est une plate-forme de développement Web sous Windows pour des applications Web dynamiques à l’aide du serveur Apache2, du langage de scripts PHP et d’une base de données MySQL.  
Il possède également PHPMyAdmin pour gérer plus facilement vos bases de données.  
#### Installation
Aller sur [www.wampserver.com](http://www.wampserver.com/) pour le télecharger.  
Puis l'installer.  
#### Configuration
Aller dans le dossier d'installation `C:\wamp64` ou `C:\wamp32` ou `C:\wamp`par défaut.  
Puis éxecuter `wampmanager.exe`.  
Maintenant aller sur [localhost](http://localhost) afin de vérifier que la page d'accueil de WAMP soit disponible.  
#### Ajouter un virtualhost
Aller sur http://localhost/add_vhost.php?lang=french.  
Dans **nom du virtualhost** saisissez `sdtd`.  
Dans **chemin complet absolu** saisissez `D:\logClient`.  
Valider en cliquant sur **Démarrer la création du VirtualHost**.  

Cependant, pour que ce nouveau VirtualHost soit pris en compte par Apache, vous devez lancer l'item **Redémarrage DNS**.  
Dans la barre de tache de Windows, Clic-Droit sur l'icône Wampmanager puis *Oultils > Redémarrage DNS*.  
Ceci ne peut, hélas, pas être fait automatiquement.  
#### La base de donnée
Aller sur http://localhost/phpmyadmin/. Connectez vous en tant que **root** et sans mot de passe.  
Dans la barre horizontale, tout en haut, aller dans l'onglet **SQL**.  
Copier coller le texte suivant:  
```
CREATE DATABASE IF NOT EXISTS `sdtd`;
CREATE TABLE `sdtd`.`deathcount` ( `world` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `death` INT(5) NOT NULL DEFAULT '0' , PRIMARY KEY (`world`));
CREATE USER 'sdtdUser'@'localhost' IDENTIFIED BY 'sdtdPass';
GRANT USAGE ON *.* TO 'sdtdUser'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 3600 MAX_CONNECTIONS_PER_HOUR 3600 MAX_UPDATES_PER_HOUR 3600 MAX_USER_CONNECTIONS 3600;
GRANT ALL PRIVILEGES ON `sdtd`.* TO 'sdtdUser'@'localhost';

```
Et **Exécuter**.  

## Utilisation
Dans OBS, créer une BrowserSource avec l'url suivante:  

`http://sdtd/kill.html`

Cependant la base de donnée est encore vide.  
Pour saisir le nombre de mort pour un monde existant:
* Lancer le jeu, démmaré la partie et récuperer le nombre de fois que vous êtes mort (Menu Personnage).
* Utiliser votre navigateur web et aller sur http://sdtd/api/getworld.php pour recuperer le nom du monde.  
* Utiliser votre navigateur web et aller sur [http://sdtd/api/setdeath.php?world=**toto**&death=**99**](http://sdtd/api/setdeath.php?world=&death=) en prenant soin de modifier **toto** par le nom du monde et **99** par le nombre de mort.

*****
*****
*****
# Troll Kill
Affiche un Popup quand un joueur mort.

## Installation
Identique à **Death Count**

## Configuration
Identique à **Death Count**

## Utilisation
Dans OBS, créer une BrowserSource avec l'url suivante:  

`http://sdtd/kill.html`
