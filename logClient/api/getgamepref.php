<?php
include 'api.php';

$json = array();

// get good file name
$fileName = GetFileName($dir);
if( !$fileName['error'] ) { // if file found
	// extract file content
	$rawLog = GetRawLog($fileName['name']);
	if( !$rawLog['error'] ) { // 
		// parse log
		$parseLogs = ParseLog($rawLog['logs']);
		$json['game'] = $parseLogs['game'];
		$json['error'] = $rawLog['error'];
		
	}
	else {
		$json['error'] = $rawLog['error'];
		$json['message'] = $rawLog['message'];
	}
}
else {
	$json['error'] = $fileName['error'];
	$json['message'] = $fileName['message'];
}

header('Content-Type: application/json');
echo json_encode($json);
?>