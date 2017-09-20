function DayOfWeek (days) {
	return days % 7 > 0 ? days % 7 : 7;
}

function TimeTitle (gametime) {
	var dayOfWeek = DayOfWeek (gametime.days);
	// Show days til blood moon:
	result = "Blood Moon dans <span id=\"colortext\">" + (7 - dayOfWeek) + " jours</span>";
	return result;
}

function StartBannerModule () {
	var updateGameTimeEvent = function() {
		$.getJSON( "../../api/getwebuiupdates?adminuser=obsuser&admintoken=obstoken")
		.done(function(data) {
			$("#blood_moon").html(TimeTitle(data.gametime));
			$("#nb_players").html ("<span id=\"colortext\">" + data.players + "</span> Joueurs");
			$("#nb_hostiles").html ("<span id=\"colortext\">" + data.hostiles + "</span> Hostiles");
			$("#nb_animals").html ("<span id=\"colortext\">" + data.animals + "</span> Animaux");
			console.log("Banner Updated");
		})
		.fail(function(jqxhr, textStatus, error) {
			console.log("Error fetching ui updates");
		})
		.always(function() {
		});
		window.setTimeout(updateGameTimeEvent, 2000);
	};
	updateGameTimeEvent();
}

StartBannerModule ();