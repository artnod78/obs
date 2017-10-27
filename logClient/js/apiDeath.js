var nbLine = 0;
var world;
function StartKillModule () {
    var timeout = null;

    var updateEvent = function() {
		if(nbLine == 0){// on recupere maxLog
			console.log("Get Line\tInit");
			$.getJSON( "api/getlog.php")
				.done(function(data){
					nbLine = data.maxLog;
					console.log("Get Line\tSuccess\t\t" + nbLine);
				})
				.fail(function(jqxhr, textStatus, error) {
					console.log("Get Line\tError\t\t"+error);
				});
			timeout = window.setTimeout(updateEvent, 2000);
		}
		else{// Parse log to find death
			
			
			$.getJSON("api/getlog.php?firstLine=" + (nbLine))
				.done(function(data) {
					if (data.firstLine == data.lastLine){
						if(data.maxLog < data.lastLine){// New log file
							console.log("Get Log\t\tSuccess\t\tNew log File");
							nbLine = 0;
						}
						else {// No new log
							console.log("Get Log\t\tSuccess\t\tNo new log\t\t" + (nbLine));
						}
					}
					else{// New log
						console.log("Get Log\t\tSuccess\t\tNew log\t\t\t" + (data.maxLog));
						// on met a jour le numero de la derniere ligne lu
						nbLine = data.maxLog;
						
						// Pour chaque nouvelle ligne de log
						for (var i = 0; i < data.entries.length; i++) {
							var logLine = data.entries[i].msg;
							
							// si un joueur est mort
							if(logLine.match("GMSG: Player \'(.*)\' died")){
								
								// on recupere le nom du monde
								$.getJSON( "api/getworld.php")
									.done(function(data){
										if( data.error == false ){
											console.log("Get World\tSuccess\t\t"+data.world);
											var world = data.world;
											
											// on recuepre le nombre de mort sur se monde
											$.getJSON( "api/getdeath.php?world=" + world)
												.done(function(data){
													console.log("Get Death\tSuccess\t\t"+data.death);
													var nbDeath = data.death;
													
													// on met a jour le html
													$("#nb_death").html ("Death Count: <span id=\"colortext\">" + (nbDeath+1) + " </span>");
													
													// on met a jour le site web
													$.get( "api/setdeath.php?world=" + world + "&death="+(nbDeath+1))
														.done(function(){
															console.log("Set Death\tSuccess\t\t"+(nbDeath+1));
														})
														.fail(function(jqxhr, textStatus, error) {
															console.log("Set Death\tError\t\t"+error);
														});
												})
												.fail(function(jqxhr, textStatus, error) {
													console.log("Get Death\t\tError\t\t"+error);
												});
										}
										else{
											console.log("Get World\t\tError\t\t"+data.message);
										}
									})
									.fail(function(jqxhr, textStatus, error) {
										console.log("Get World\t\tError\t\t"+error);
									});
							}
							
							// si on change de monde
							else if(logLine.match("createWorld: ")){
								$.getJSON( "api/getworld.php")
									.done(function(data){
										if( data.error == false ){
											console.log("Get World\tSuccess\t\t"+data.world);
											var world = data.world;
											
											// on recuepre le nombre de mort sur se monde
											$.getJSON( "api/getdeath.php?world=" + world)
												.done(function(data){
													console.log("Get Death\tSuccess\t\t"+data.death);
													
													// on met a jour le html
													$("#nb_death").html ("Death Count: <span id=\"colortext\">" + (data.death) + " </span>");
												})
												.fail(function(jqxhr, textStatus, error) {
													console.log("Get Death\t\tError\t\t"+error);
												});
										}
										else{
											console.log("Get World\t\tError\t\t"+data.message);
										}
									})
									.fail(function(jqxhr, textStatus, error) {
										console.log("Get World\t\tError\t\t"+error);
									});
								
							}
							// si on quitte le monde
							else if(logLine.match("World.Unload")){
								// reset overlay
								$("#nb_death").html ("Death Count: <span id=\"colortext\">0 </span>");
							}
						}	
					}
				})
				.fail(function(jqxhr, textStatus, error) {
					console.log("Get Log\t\tError\t\t"+error);
				});
			timeout = window.setTimeout(updateEvent, 2000);
		}
	};
	updateEvent ();
}
StartKillModule();