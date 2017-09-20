# PopUp lorsqu'un joueur mort
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
