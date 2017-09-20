var nbLine = 0;
var initNbLine = 0;
var nbdiv = 0;
function StartKillModule () {
    var maxLinesPerRequest = 50;
    var timeout = null;
    var body = $("body");
    var lastRead = -1;

    var updateEvent = function() {
        // on se place à la fin des log
        if(nbLine == 0){
			$.getJSON( "./log.php?firstLine=" + (initNbLine)).done(function(data){
				if (data.entries.length > 0) {
					initNbLine = data.lastLine;
                }
				if((data.firstLine) == data.lastLine){
					nbLine = initNbLine;
					console.log("End of Log");
					
				}
				else{
					console.log("Log Init");
				}
				
			})
			.fail(function(jqxhr, textStatus, error) {
				nbLine = 0;
                console.log("error init");
			});
			timeout = window.setTimeout(updateEvent, 500);
		}
        else{
            $.getJSON("./log.php?firstLine=" + (nbLine))
            .done(function(data) {
				if(data.firstLine == data.lastLine){
					if(data.maxLog == data.firstLine){
						console.log("No new log");
					}
					else{
						nbLine = 0;
						initNbLine = 0;
						console.log("New log File");
					}
				}
				else{
                    console.log("New log Read");
					// Pour chaque nouvelle ligne de log
					for (var i = 0; i < data.entries.length; i++) {
						var logMsg = data.entries[i].msg;
						var tmpLogMsg = logMsg.match("GMSG: Player \'(.*)\' died");
						// si un joueur est mort
						if(tmpLogMsg){
							// on recupere le nom du joueur
							var playerName = tmpLogMsg[1];
							// on ajoute du contenu
							$(".div"+(nbdiv-1)).remove();
							$("body").append($("<div></div>").attr("id", "killContainer").addClass("div" + nbdiv));
							$("#killContainer").append($("<div></div>").attr("id", "killHeader"));
							$("#killHeader").append($("<span>Alerte Troll</span>").attr("id", "spanHeader"));
							$("#killContainer").append($("<div></div>").attr("id", "killContent"));
							$("#killContent").append($("<image id='sdtdLogo' src='img/Brokenbone_icon.png'>"));
							$("#killContent").append($("<div></div>").attr("id", "killContentText"));
							$("#killContentText").append($("<span>" +  playerName + " est mort! Il aurait dû payer son atelle !!!" + "</span>"));
							nbdiv = nbdiv + 1;
							console.log(playerName+" died");
						}
					}
					// on met a jour le numero de la derniere ligne lu
					nbLine = data.lastLine;
				}
            })
            .fail(function(jqxhr, textStatus, error) {
                    console.log("error read log");
            })
            .always(function() {
            });
            timeout = window.setTimeout(updateEvent, 1000);

                }
        };
        updateEvent ();
}
StartKillModule();