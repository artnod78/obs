//InitializeTabs ();
var tabs = $("#adminmenu").tabbedContent ({
        contentdiv: $("#killContainer"),
        hideOnStart: false,
});
tabs.tabbedContent ("applyPermissions");