# PopUp lorsqu'un joueur mort
Nécessite les **Alloc fixes** d'installer sur le serveur de jeu. [Disponible ici](https://7dtd.illy.bz/wiki/Server%20fixes)  
Nécessite le ControlPanel d'activé.  
Utilise l'API et le serveur Web des **Alloc fixes**.  
Ne fonctionne pas encore quand un joueur se fait tuer par un autre joueur.  

## Installation
Copier le dossier **obs** dans le repertoire du site web:  
`gamefolder\Mods\Allocs_WebAndMapRendering\webserver\`  

## Configuration
Editer le fichier **webpermissions.xml**.  
Ajouter l'**admintoken** suisant:  
`<token name="obsuser" token="obstoken" permission_level="500" />`  

Modifier la ligne avec **webapi.getlog** pour quelle ressemble a ceux-ci:  
`<permission module="webapi.getlog" permission_level="500" />`

Editer la ligne **3** du fichier log.php afin que le chemin corresponde avec celui du jeu.  
Le chemin doit finir par un slash ( **/** ):  
`$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';`  

## Utilisation
Dans OBS, créer une **BrowserSource** avec l'url suivante:  
`http://ServerNameOrIP/static/obs/kill.html`
