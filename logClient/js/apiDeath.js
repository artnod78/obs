var player = null;
var world = null;
var nbDeath = 0;
var nbLine = null;

var firstRun = true;
var lastNbDeath = null;
var timeout = null;

// GET DATA
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

// SET DATA
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

// MAIN FUNCTION
function updateOverlay(){
	// on met a jour l'overlay
	if(lastNbDeath != nbDeath){
		console.log("Update\t\tOverlay\t\t" + nbDeath);
		$("#colortext").html (nbDeath);
		lastNbDeath = nbDeath;
	}
}

function getFirstRun(){
	// initialisation au premier lancement
	if(firstRun == true){
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
			nbDeath = 0;
		}
		// on recupere le numero de la dernière ligne
		nbLine = getLastLine();
		console.log("First Run\tLast Line\t" + nbLine);
		firstRun = false;
	}
}

function scanLog(){
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
		console.log("Get Log\t\tSuccess\t\tNew log\t\t\t" + (logs.firstLine));
		
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
				nbDeath = 0;
			}
		}
		
		// on met a jour le numero de la prochaine ligne à lire
		nbLine = logs.lastLine +1;
	}
}

var updateEvent = function() {
	updateOverlay();
	getFirstRun();
	scanLog();
	timeout = window.setTimeout(updateEvent, 2000);
};
updateEvent();