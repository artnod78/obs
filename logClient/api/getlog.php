<?php
include 'api.php';

// GET param "start" and "end"
$start = null;
$maxLine = 50;
if( !isset($_GET["firstLine"]) AND !isset($_GET["lastLine"]) ) {
	$start = 0;
}
if( isset($_GET["firstLine"]) AND !isset($_GET["lastLine"]) ) {
	$start = intval($_GET["firstLine"]);
	$maxLine = $start + $maxLine;
}
if( !isset($_GET["firstLine"]) AND isset($_GET["lastLine"]) ) {
	$tmp = intval($_GET["lastLine"]);
	if($tmp > $maxLine) {
		$start = $tmp - $maxLine;
		$maxLine = $tmp;
	}
	else {
		$start = 0;
	}
}
if( isset($_GET["firstLine"]) AND isset($_GET["lastLine"]) ) {
	if( (intval($_GET["lastLine"]) - intval($_GET["firstLine"])) < $maxLine ) {
		$start = intval($_GET["firstLine"]);
		$maxLine = intval($_GET["lastLine"]);
	}
	else {
		$start = intval($_GET["firstLine"]);
		$maxLine = intval($_GET["firstLine"]) + $maxLine;
		
	}
}


// ##### START HERE #####
$json = array();
$entries = array();
// get good file name
$fileName = GetFileName($dir);
if( !$fileName['error'] ) { // if file found
	// add data
	$json['firstLine'] = $start;
	// extract file content
	$rawLog = GetRawLog($fileName['name']);
	if( !$rawLog['error'] ) { // 
		// parse log
		$parseLogs = ParseLog($rawLog['logs']);
		$log = $parseLogs['log'];
		// extract range from log
		$rangeLog = array_slice($log, $start, $maxLine);	
		// add data
		$json['lastLine'] = $start + count($rangeLog);
		if( count($rangeLog) > 0 ) {
			$json['entries'] = $rangeLog;
		}
		else {
			$json['entries'] = array();
		}
		$maxLog = count($log);
		$json['maxLog'] = $maxLog;
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