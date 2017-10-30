var nbLine = null;
var player = null;
var nbdiv = 0;

var firstRun = true;
var timeout = null;
// GET DATA
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

function updateOverlay(){
	// on ajoute du contenu
	var body = $("body");
	$(".div"+(nbdiv-1)).remove();
	$("body").append($("<div></div>").attr("id", "killContainer").addClass("div" + nbdiv));
	$("#killContainer").append($("<div></div>").attr("id", "killHeader"));
	$("#killHeader").append($("<span>Alerte Troll</span>").attr("id", "spanHeader"));
	$("#killContainer").append($("<div></div>").attr("id", "killContent"));
	$("#killContent").append($("<image id='sdtdLogo' src='img/Brokenbone_icon.png'>"));
	$("#killContent").append($("<div></div>").attr("id", "killContentText"));
	$("#killContentText").append($("<span>" +  player + " est mort<br>comme un fragile !!!" + "</span>"));
	nbdiv = nbdiv + 1;
}

// MAIN FUNCTION
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
function getFirstRun(){
	// initialisation au premier lancement
	if(firstRun == true){		
		// on recupere le numero de la dernière ligne
		nbLine = getLastLine();
		console.log("First Run\tLast Line\t" + nbLine);
		firstRun = false;
	}
}

function scanLog(){
	var logs = getLog();
	if (logs.entries.length == 0){
		if(logs.maxLog < logs.lastLine){// New log file
			console.log("Get Log\t\tSuccess\t\tNew log File");
			firstRun = true;
		}
		else {// No new log
			console.log("Get Log\t\tSuccess\t\tNo new log\t\t"+nbLine);
		}
		
	}
	else{// New log		
		console.log("Get Log\t\tSuccess\t\tNew log\t\t\t" + nbLine);		
		// Pour chaque nouvelle ligne de log
		for (var i = 0; i < logs.entries.length; i++) {
			var logLine = logs.entries[i].msg;
			// si un joueur est mort
			var playerDiedMsg = logLine.match("GMSG: Player \'(.*)\' died");
			if(playerDiedMsg){
				// on recupere le nom du joueur
				player = playerDiedMsg[1];
				// on met à jour l'overlay
				updateOverlay();
				console.log("Log\t\t\tPlayer\t\tDied\t\t\t"+player);
			}
		}
	}
	// on met a jour le numero de la derniere ligne lu
	nbLine = logs.maxLog;
}



var updateEvent = function() {
	getFirstRun();
	scanLog();
	timeout = window.setTimeout(updateEvent, 2000);
};
updateEvent();

