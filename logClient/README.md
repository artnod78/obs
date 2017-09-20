# PopUp lorsqu'un joueur mort
Nécessite un serveur Web avec PHP fonctionnel sur le même PC.  
Lis le dernier fichier d'évenements (log) du jeu
Ne fonctionne pas encore quand un joueur se fait tuer par un autre joueur.  

## Installation
Copier les fichiers et dossiers dans le repertoire de votre site web.  
Sauf READMME.md  

## Configuration
Editer la ligne **3** du fichier log.php afin que le chemin corresponde avec celui du jeu.  
Le chemin doit finir par un slash ( **/** )  

`$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';`  

## Utilisation
Dans OBS, créer une BrowserSource avec l'url suivante:  

`http://localhost/kill.html`
