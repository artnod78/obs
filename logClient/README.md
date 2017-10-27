# Death Count
Il s'agit d'un petit overlay qui affiche le nombre de morts.  
* Scan le fichier de log
* Incrémente une valeur en base de donnée lorsqu'il détecte la mort d'un joueur
* Chaque monde démarré à son nombre de mort.

Il est impossible de savoir via les log combien de fois est mort un joueur. Mais la mort d'un joueur est détectable.  
L'overlay ne fait qu'incrementer une valeur lorsqu'un joueur mort.  
A l'heure actuelle, il est impossible de savoir le nombre de mort qu'il y a eu avant que l'overlay soit lancé.  
Ainsi que le nombre de mort lorsque l'overlay n'est pas lancé.  

*****
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
#### Créer la base de donnée
Aller sur http://localhost/phpmyadmin/. Connectez vous en tant que root et sans mot de passe.  
Aller dans l'onglet **compte Utilisateurs**, puis cliquer sur **Ajouter un compte d'utilisateur**.
* nom d'utilisateur: **sdtd**
* nom d'hôte: **localhost**
* mot de passe: **sdtd**
* Cocher la case **Créer une base portant son nom et donner à cet utilisateur tous les privilèges sur cette base.**  

Puis **Exécuter** pour créer l'utilisateur et sa base de données.  
Si vous voulez utiliser des identifiants différent, il faut modifier le fichier `D:\logClient\api\api.php` ligne **137**.  
`$mysqli = new mysqli("hostname", "user", "pass", "database");`  



Aller dans l'onglet **Base de données**, puis cliquer sur **sdtd** dans la liste des base de données.  
Ajouter une table nommée  **local** avec **2** colonnes.  
Maintenant il va falloir définr les deux colonnes.  
**1ère colonnes:**  
* nom: **world**
* type: **varchar**
* taille: **25**
* index: **unique**

**1ème colonnes:**  
* nom: **death**
* type: **int**
* taille: **5**

Puis **Enregistrer** pour créer la table avec ses 2 colonnes. 


## Utilisation
Il est accessible via son url: [sdtd/death.html](http://sdtd/death.html)

Cependant la base de donnée est encore vide.  
Pour saisir le nombre de mort pour un monde existant:
* Lancer le jeu, démmaré la partie et noter le nombre de fois que vous êtes mort (Menu Personnage).
* Utiliser votre navigateur web et aller sur http://sdtd/api/getworld.php pour connaitre le nom du monde.  
* Utiliser votre navigateur web et aller sur [http://sdtd/api/setdeath.php?world=**toto**&death=**99**](http://sdtd/api/setdeath.php?world=&death=) en prenant soin de modifier **toto** par le nom du monde et **99** par le nombre de mort.

















*****
# Troll Kill
Nécessite un serveur Web avec PHP fonctionnel sur le même PC.  [Tuto installer un serveur web](https://notes-de-cours.com/web/blogue/49/configurer-php-et-nginx-sous-windows)  
Lis le dernier fichier d'évenements (log) du jeu.  
Ne fonctionne pas encore quand un joueur se fait tuer par un autre joueur.  

## Installation
Copier le contenu de **logClient** dans le repertoire de votre site web.  
Sauf READMME.md  

## Configuration
Editer la ligne **3** du fichier log.php afin que le chemin corresponde avec celui du jeu.  
Le chemin doit finir par un slash ( **/** )  

`$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';`  

## Utilisation
Dans OBS, créer une BrowserSource avec l'url suivante:  

`http://localhost/kill.html`
