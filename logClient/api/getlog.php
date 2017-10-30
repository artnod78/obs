<?php
include 'api.php';

$start = null;
$maxLine = null;

if( !isset($_GET["firstLine"]) AND !isset($_GET["lastLine"]) ) {
	$start = 0;
	$maxLine = 49;
}
else if( isset($_GET["firstLine"]) AND !isset($_GET["lastLine"]) ) {
	$start = intval($_GET["firstLine"]);
	$maxLine = intval($_GET["firstLine"]) + 49;
}
else if( !isset($_GET["firstLine"]) AND isset($_GET["lastLine"]) ) {
	if(intval($_GET["lastLine"]) > 49) {
		$start = intval($_GET["lastLine"]) - 49;
		$maxLine = intval($_GET["lastLine"]);
	}
	else {
		$start = 0;
		$maxline = 49;
	}
}
else if( isset($_GET["firstLine"]) AND isset($_GET["lastLine"]) ) {
	if ( intval($_GET["lastLine"]) < intval($_GET["firstLine"]) ){
		$start = intval($_GET["firstLine"]);
		$maxLine = intval($_GET["firstLine"]) + 49;
		
	}
	else if( (intval($_GET["lastLine"]) - intval($_GET["firstLine"])) < 49 ) {
		$start = intval($_GET["firstLine"]);
		$maxLine = intval($_GET["lastLine"]);
	}
	else {
		$start = intval($_GET["firstLine"]);
		$maxLine = intval($_GET["firstLine"]) + 49;
		
	}
}

$json = array();

// get good file name
$fileName = GetFileName($dir);
if( !$fileName['error'] ) { // if file found
	// extract file content
	$rawLog = GetRawLog($fileName['name']);
	if( !$rawLog['error'] ) { // 
		// parse log
		$parseLogs = ParseLog($rawLog['logs']);
		$log = $parseLogs['log'];
		// extract range from log
		if(count($log) > $maxLine){
			$rangeLog = array_slice($log, $start, ($maxLine - $start + 1));	
		}
		else{
			$rangeLog = array_slice($log, $start, (count($log) - $start + 1));	
		}

		// add data
		$json['firstLine'] = $start;
		
		if($start > ($start + count($rangeLog) - 1)){
			$json['lastLine'] = $start;
		}
		else{
			$json['lastLine'] = $start + count($rangeLog) - 1;
		}
		$json['maxLog'] = count($log);
		if( count($rangeLog) > 0 ) {
			$json['entries'] = $rangeLog;
		}
		else {
			$json['entries'] = array();
		}
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