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
		$log = $parseLogs['log'];
		
		$patern = "#^(createWorld: )#";
		$worldFound = false;
		foreach( $log as $line) {
			$debut = null;
			if(preg_match($patern, $line['msg'], $debut) !== 0) {
				$reste = preg_replace($patern, '', $line['msg']);
				$keywords = preg_split("/[,][ ]+/", $reste);
				$json['world'] = $keywords[1];
				$worldFound = true;
			}
		}
		if($worldFound){
			$json['error'] = false;
		}
		else{
			$json['error'] = true;
			$json['message'] = "World name not found";
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