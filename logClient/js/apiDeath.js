var player = null;
var world = null;
var nbDeath = null;

var nbLine = null;

var firstRun = true;
var lastNbDeath = null;

function getPlayer(){
	var mydata = [];
	$.ajax({
		url: 'api/getplayer.php',
		async: false,
		dataType: 'json',
		success: function (jsonData) {
			mydata = jsonData;
		}
	});
	return mydata;
}

function getWorld(){
	var mydata = [];
	$.ajax({
		url: 'api/getworld.php',
		async: false,
		dataType: 'json',
		success: function (jsonData) {
			mydata = jsonData;
		}
	});
	return mydata;
}

function getDeath(){
	var mydata = [];
	$.ajax({
		url: 'api/getdeath.php?world=' + world,
		async: false,
		dataType: 'json',
		success: function (jsonData) {
			mydata = jsonData;
		}
	});
	return mydata;
}

function getLastLine(){
	var mydata = [];
	$.ajax({
		url: 'api/getlog.php',
		async: false,
		dataType: 'json',
		success: function (jsonData) {
			mydata = jsonData.maxLog;
		}
	});
	return mydata;
}

function getLog(){
	var mydata = [];
	$.ajax({
		url: 'api/getlog.php?firstLine=' + nbLine,
		async: false,
		dataType: 'json',
		success: function (jsonData) {
			mydata = jsonData;
		}
	});
	return mydata;
}

function setDeath(){
	$.ajax({
		url: 'api/setdeath.php?world=' + world + "&death=" + nbDeath ,
		async: false,
		dataType: 'json',
		success: function () {
			console.log("Update BDD\t" + world + " - " + nbDeath);
		}
	});
	
}

function getFirstRun(){
	
	// on recupere le nom du joueur
	var getplayer = getPlayer();
	if(getplayer.error == false){
		player = getplayer.player;
		console.log("First Run\tPlayer\t\t" + player);
	}
	else{
		console.log("First Run\tPlayer\t\tNot Found");
	}
	
	// on recupere le nom du dernier monde chargé
	var getworld = getWorld();
	if(getworld.error == false){
		world = getworld.world;
		console.log("First Run\tWorld\t\t" + world);
		
		// on recupere le nombre de mort
		var getdeath = getDeath();
		if(getdeath.error == false){
			nbDeath = getdeath.death;
			console.log("First Run\tDeath\t\t" + nbDeath);
		}
		else{
			console.log("First Run\tDeath\t\tNot Found");
			nbDeath = 0;
		}
	}
	else{
		console.log("First Run\tWorld\t\tNot Found");
		console.log("First Run\tDeath\t\tNot Found");
	}
	
	// on recupere le numero de la dernière ligne
	nbLine = getLastLine();
	console.log("First Run\tLast Line\t" + nbLine);
}

function updatePlayer(){
	var getplayer = getPlayer();
	if(getplayer.error == false){
		player = getplayer.player;
		console.log("Update\t\tPlayer\t\t" + player);
	}
	else{
		console.log("Update\t\tPlayer\t\tNot Found");
	}
}

function updateWorld(){
	var getworld = getWorld();
	if(getworld.error == false){
		world = getworld.world;
		console.log("Update\t\tWorld\t\t" + world);
	}
	else{
		console.log("Update\t\tWorld\t\tNot Found");
	}
}

function updateDeath(){
	var getdeath = getDeath();
	if(getdeath.error == false){
		nbDeath = getdeath.death;
		console.log("Update\t\tDeath\t\t" + nbDeath);
	}
	else{
		console.log("Update\t\tDeath\t\tNot Found");
	}
}



function StartKillModule () {
    var timeout = null;

    var updateEvent = function() {
		// on met a jour l'overlay
		if(lastNbDeath != nbDeath){
			console.log("Update\t\tOverlay\t\t" + nbDeath);	
			if(nbDeath != null){
				$("#nb_death").html ("Death Count: <span id=\"colortext\">" + nbDeath + " </span>");
			}
			else{
				$("#nb_death").html ("Death Count: <span id=\"colortext\">0 </span>");
			}
			lastNbDeath = nbDeath;
		}
		
		// initialisation au premier lancement
		if(firstRun == true){
			getFirstRun();
			firstRun = false;
		}
		
		var logs = getLog();
		if (logs.firstLine == logs.lastLine){
			if(logs.maxLog < logs.lastLine){// New log file
				console.log("Get Log\t\tSuccess\t\tNew log File");
				firstRun = true;
			}
			else {// No new log
				console.log("Get Log\t\tSuccess\t\tNo new log\t\t" + (nbLine));
			}
			
		}
		else{// New log
			console.log("Get Log\t\tSuccess\t\tNew log\t\t\t" + (logs.maxLog));
			
			// on met a jour le numero de la derniere ligne lu
			nbLine = logs.lastLine;
			
			// Pour chaque nouvelle ligne de log
			for (var i = 0; i < logs.entries.length; i++) {
				var logLine = logs.entries[i].msg;
				
				// si un joueur est mort
				if(logLine.match("GMSG: Player \'" + player + "\' died")){	
					console.log("Log\t\t\tPlayer\t\tDied");
					// on increment le nombre de mort
					nbDeath++;
					// on met à jour la bdd
					setDeath();
				}
				
				// si on démarre de monde
				if(logLine.match("createWorld: ")){
					// on met a jour le nom du joueur
					updatePlayer();
					// on met a jour le nom du monde
					updateWorld();
					// on met a jour le nombre de mort
					updateDeath();
				}
				
				// si on quitte le monde
				if(logLine.match("World.Unload")){
					console.log("Unload\t\tWorld\t\t" + world);
					// reset world
					world = null;
					// reset nbDeath
					nbDeath = null;
					
				}
			}	
		}		
		timeout = window.setTimeout(updateEvent, 2000);
		
	};
	updateEvent ();
}
StartKillModule();