var timeout = null;
var updateEvent = function() {
	console.log("Run loop");
	var mydata = [];
	$.ajax({
		url: 'api/getgamepref.php',
		async: false,
		dataType: 'json',
		success: function (jsonData) {
			mydata = jsonData;
		}
	});
	var gamePref = mydata.game;		
	var bloodcount = gamePref.BloodMoonEnemyCount;
	if(bloodcount < 10){
		bloodcount = "0"+bloodcount;
	}
	var airdrop = gamePref.AirDropFrequency/24;
	if(airdrop < 10){
		airdrop = "0"+airdrop;
	}
	var loot = gamePref.LootRespawnDays;
	if(loot < 10){
		loot = "0"+loot;
	}
	
	var GameDifficulty = "Difficulty: <span id=\'colortext\'>" + gamePref.GameDifficulty + "</span>";
	var ZombiesRun = "Zombies run: <span id=\'colortext\'>" + parseInt(gamePref.ZombiesRun) + "</span>";
	var BloodMoonEnemyCount = "Blood moon: <span id=\'colortext\'>" + bloodcount + " zombies</span>";
	var AirDropFrequency = "Air drop: <span id=\'colortext\'>" + airdrop + " days</span>";
	var AirDropMarker = "Air drop maker: <span id=\'colortext\'>" + gamePref.AirDropMarker + "</span>";
	var LootRespawnDays = "Loot respawn: <span id=\'colortext\'>" + loot + " days</span>";
	var msg = GameDifficulty + " - " + ZombiesRun + " - " + BloodMoonEnemyCount +  " - " + AirDropFrequency +  " - " + AirDropMarker +  " - " + LootRespawnDays +  " - ";
	$("#infoContainer").html ("<span id=\"infoDefile\">" + msg + msg + "</span>");
	timeout = window.setTimeout(updateEvent, 20000);
};