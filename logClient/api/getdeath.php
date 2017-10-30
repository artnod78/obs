<?php
include 'api.php';

$json = array();

if( isset($_GET["all"])) {
	$query = sqlQuery($sqlhost, $sqluser, $sqlpass, $sqldb, $sqltable);
	if( !$query['error'] ) {
		$json = array('entries' => $query['entries'], 'error' => $query['error']);
	}
	else {
		$json = array('error' => $query['error'], 'message' => $query['message']);
	}
}
else if( !isset($_GET["world"])) {
	$json = array('error' => true, 'message' => "need world param");
}
else{
	$query = sqlQuery($sqlhost, $sqluser, $sqlpass, $sqldb, $sqltable);
	if( !$query['error'] ) {
		$entries = $query['entries'];
		$wordlFound = false;
		foreach($entries as $line){// parcourir chaque entries
			// si line['world'] == param world
			if($line['world'] == $_GET["world"]){
				// retourne line['death']
				$json = array('death' => intval($line['death']), 'error' => false);
				$wordlFound = true;
			}
		}
		if(!$wordlFound){
			$json = array('death' => 0, 'error' => false);
		}
	}
	else {
		if($query['message'] == 'no entries'){
			$json = array('death' => 0, 'error' => false);	
		}
		else{
			$json['error'] = $query['error'];
			$json['message'] = $query['message'];
		}
	}
}

header('Content-Type: application/json');
echo json_encode($json);
?>