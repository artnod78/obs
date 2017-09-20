var userdata = false;

function InitPermissions () {
	$.getJSON( "../../userstatus")
	.done(function(data) {
		userdata = data;

		var userdataDiv = $("#userstate");
		if (userdata.loggedin == true) {
			var data = userdataDiv.children ("#userstate_loggedin");
			data.attr ("style", "display: block");
			data.children ("#username").attr ("href", "http://steamcommunity.com/profiles/" + userdata.username);
			data.children ("#username").html (userdata.username);
		} else {
			var data = userdataDiv.children ("#userstate_loggedout");
			data.attr ("style", "display: block");
		}
		StartBannerModule ();
		tabs.tabbedContent ("applyPermissions");

	})
	.fail(function(jqxhr, textStatus, error) {
		console.log("Error fetching user data");
	})
	.always(function () {
		if (PermissionCount () == 0) {
			$("#nopermissionwarning").attr ("style", "display: block");
		}
	})
}

function HasPermission (modulename) {
	for (var i = 0; i < userdata.permissions.length; i++) {
		if (userdata.permissions [i].module == modulename) {
			return userdata.permissions [i].allowed;
		}
	}
	return false;
}

function PermissionCount () {
	var cnt = 0;
	for (var i = 0; i < userdata.permissions.length; i++) {
		if (userdata.permissions [i].allowed) cnt++;
	}
	return cnt;
}
