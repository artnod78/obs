# Overlays pour 7 Days To Die
Ensemble d'overlays interagissant avec les fichies log du jeu.
* **Death Count**: Affiche le nombre de mort de la partie en cours.
* **Info World**: Affiche les info de la partie en cours.
  * Difficulty
  * Zombies run
  * Blood moon
  * Air drop
  * Air drop maker
  * Loot respawn
* **Troll Kill**: Affiche une fenêtre pendant 10 sec, lorsqu'un joueur mort.  

## Installation
1. Télecharger les overlays à cette adresse: https://github.com/artnod78/obs/archive/master.zip.  
1. Décompresser le zip. Puis copier / coller le dossier **logClient** dans un autre dossier. Par exemple dans `D:/logClient`.
1. Télécharger et installer **WAMP Server**. http://www.wampserver.com/

## Configuration
1. Modifier la ligne **2** du fichier `D:/logClient/api/api.conf` en indiquant le chemin du jeu. 
   * **ATTENTION** les séparateurs doivent être des slash **" / "** et non des anti-slash **" \ "**.
   * **ATTENTION** les chemin doit finir par: **" /7DaysToDie_Data/ "**.
   * Exemple: **`$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';`**.
1. Aller sur http://localhost/add_vhost.php
   * Nom du Virtual Host: **sdtd**.
   * Chemin complet absolu: Chemin où vous avez copier / coller le dossier **logClient**. Par exemple `D:/logClient`.
   * Valider en cliquant sur **Démarrer la création du VirtualHost**. 
   * Dans la barre de tache de Windows, Clic-Droit sur l'icône Wampmanager puis *Oultils > Redémarrage DNS*.  
1. Aller sur http://localhost/phpmyadmin/
   * login: **root**. Pas de mot de passe.
   * Cliquer sur l'onglet **SQL** (barre en haut).  
   * Copier / coller le texte suivant et **Exécuter**:  
*```CREATE DATABASE IF NOT EXISTS `sdtd`;
CREATE TABLE `sdtd`.`deathcount` ( `world` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `death` INT(5) NOT NULL DEFAULT '0' , PRIMARY KEY (`world`));
CREATE USER 'sdtdUser'@'localhost' IDENTIFIED BY 'sdtdPass';
GRANT USAGE ON *.* TO 'sdtdUser'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 3600 MAX_CONNECTIONS_PER_HOUR 3600 MAX_UPDATES_PER_HOUR 3600 MAX_USER_CONNECTIONS 3600;
GRANT ALL PRIVILEGES ON `sdtd`.* TO 'sdtdUser'@'localhost';```*

## Utilisation
La liste des overlays avec leur url son disponible sur http://sdtd/.  
Sur cette page contient aussi les differents url de l'API.  

Si vous êtes mort lorsque l'overlay n'est pas lancé. La base de données ne sera pas à jour.  
Il faudra donc **mettre à jour manuellement la base de données**.  
Pour cela:
1. Rejoignez la partie voulu.
1. Allez dans le menu **Personnage** pour obtenir le nombre de mort.
1. Aller sur http://sdtd/api/getworld.php pour obtenir le nom du monde.
1. Quittez la partie. **IMPORTANT**
1. Aller http://sdtd/ et remplisser le formulaire **Update death count for a specific world** avec le nom du monde et le nombre de mort fraichement récupéré.
