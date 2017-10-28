<?php
include 'api.php';




// ##### START HERE #####
$json = array();
$entries = array();
// get good file name
$fileName = GetFileName($dir);
if( !$fileName['error'] ) { // if file found

	// extract file content
	$rawLog = GetRawLog($fileName['name']);
	if( !$rawLog['error'] ) { // 
		// parse log
		$parseLogs = ParseLog($rawLog['logs']);
		$gamePref = $parseLogs['game'];
		
		$json['player'] = $gamePref['PlayerName'];
		$json['error'] = false;
	}
	else {
		$json['error'] = $rawLogs['error'];
		$json['message'] = $rawLogs['message'];
	}
}
else {
	$json['error'] = $fileName['error'];
	$json['message'] = $fileName['message'];
}

header('Content-Type: application/json');
echo json_encode($json);
?>