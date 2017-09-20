<?php
// temp var - Import from xml
$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';
$maxLine = 50;

// var
$start = null;
$end = null;
$maxLog = null;

// GET param "start" and "end"
if( !isset($_GET["firstLine"]) AND !isset($_GET["lastLine"]) ) {
	$start = 0;
	$end = $maxLine;
}
if( isset($_GET["firstLine"]) AND !isset($_GET["lastLine"]) ) {
	$start = intval($_GET["firstLine"]);
	$end = $start + $maxLine;
}
if( !isset($_GET["firstLine"]) AND isset($_GET["lastLine"]) ) {
	$end = intval($_GET["lastLine"]);
	if($end > 50) {
		$start = $end - $maxLine;
	}
	else {
		$start = 0;
	}
}
if( isset($_GET["firstLine"]) AND isset($_GET["lastLine"]) ) {
	$start = intval($_GET["firstLine"]);
	$end = intval($_GET["lastLine"]);
	$maxLine = $end - $start;
}


function GetFileName($path) {
	if(is_dir($path)) {
		$name = "";
		foreach (glob($path."output_log_*.txt") as $file) {
			$name = $file;
		}
		return array('error' => false, 'name' => $name);
	}
	return array('error' => true, 'message' => "Folder not found");
}

function GetRawLog($filename) {
	if( file_exists($filename) ) {
		$lines = array();
		$handle = fopen($filename, "r") or die("Unable to open file!");
		if ($handle) {
			while (($line = fgets($handle)) !== false) {
				$lines[] = $line;
			}
			fclose($handle);
		} 
		else {
			return array('error' => true, 'message' => "Error opening the file");
		}
		return array('error' => false, 'logs' => $lines);
	}
	return array('error' => true, 'message' => "File not found");
}

function ParseLog($logs) {
	$game = array();
	$hardware = array();
	$log = array();
	$other = array();
	$system = null;
	
	
	$patern = "#^\d{4}[-]\d{2}[-]\d{2}[T]\d{2}[:]\d{2}[:]\d{2}\s\d{1,}[.]\d{3}\s#";
	foreach( $logs as $line) {
		$reste = preg_replace($patern, '', $line);
		// is Log Line
		$debut = null;
		if(preg_match($patern, $line, $debut) !== 0) {
			// extract date
			$tmpSplit = preg_split ("#[T]#", $debut[0]);
			$date = $tmpSplit[0];
			// extract time
			$tmpSplit = preg_split ("#\s#", $tmpSplit[1]);
			$time = $tmpSplit[0];			
			// extract uptime
			$uptime = strval(floatval($tmpSplit[1]));
			// extract type
			$type = null;
			preg_match("#^\D{3}#", $reste, $type);
			$type = $type[0];			
			// extract msg
			$tmpSplit = preg_split ("#^\D{3}\s#", $reste);
			$tmpSplit = preg_split ("#\r\n$#", $tmpSplit[1]);
			$msg = $tmpSplit[0];
			
			if( preg_match("/^   OS: /", $msg) !== 0) {
				$tmpSplit = preg_split ("/^   OS: /", $msg);
				$system = $tmpSplit[1];
			}
			elseif( preg_match("/^   CPU: /", $msg) !== 0) {
				$tmpSplit = preg_split ("/^   CPU: /", $msg);
				$hardware['cpu'] = $tmpSplit[1];
			}
			elseif( preg_match("/^   RAM: /", $msg) !== 0) {
				$tmpSplit = preg_split ("/^   RAM: /", $msg);
				$hardware['ram'] = $tmpSplit[1];
			}
			elseif( preg_match("/^   GPU: /", $msg) !== 0) {
				$tmpSplit = preg_split ("/^   GPU: /", $msg);
				$hardware['gpu'] = $tmpSplit[1];
			}
			
			$log[] = array( 'date' => $date, 'time' => $time, 'uptime' => $uptime, 'msg' => $msg, 'trace' => "", 'type' => $type );
		}
		// is other line
		else {
			if( preg_match("/^desktop: /", $line) !== 0) {
				$tmpSplit = preg_split ("/^desktop: /", $line);
				$tmpSplit = preg_split ("#[;]#", $tmpSplit[1]);
				$tmpSplit = preg_split ("#\r\n$#", $tmpSplit[0]);
				$hardware['display'] = $tmpSplit[0];
			}
			elseif( preg_match("/^GamePref./", $line) !== 0) {
				$tmpSplit = preg_split ("/^GamePref./", $line);
				$tmpSplit = preg_split ("/ = /", $tmpSplit[1]);
				$param = $tmpSplit[0];
				$value = preg_split ("#\r\n$#", $tmpSplit[1]);
				$game[$param] = $value[0];
			}
			elseif( preg_match("/^GameStat./", $line) !== 0) {
				$tmpSplit = preg_split ("/^GameStat./", $line);
				$tmpSplit = preg_split ("/ = /", $tmpSplit[1]);
				$param = $tmpSplit[0];
				$value = preg_split ("#\r\n$#", $tmpSplit[1]);
				$game[$param] = $value[0];
			}
			
			$tmp = preg_split ("#\r\n$#", $line);
			$other[] = $tmp[0];
		}
	}
	return array('game' => $game, 'hardware' => $hardware, 'log' => $log, 'other' => $other, 'system' => $system);
}


// Parse a msg
function IsGMSG($line) {
	if (strpos($line, "GMSG") !== false) { return true; }
	else return false;
}
function IsDied($string) {
	if (strpos($string, "' died") !== false) { return true; }
	return false;
}
function IsKilled($string) {
	if (strpos($string, "' killed by '") !== false) { return true; }
	return false;
}


// ##### START HERE #####
// init json output var
$json = array();
$entries = array();

// get good file
$fileName = GetFileName($dir);

if( !$fileName['error'] ) {
	// add data
	$json['firstLine'] = $start;
	
	// extract file content
	$rawLog = GetRawLog($fileName['name']);
	
	if( !$rawLog['error'] ) {		
		// parse log
		$parseLogs = ParseLog($rawLog['logs']);
		$log = $parseLogs['log'];
		$maxLog = count($log);
		// extract range from log
		$rangeLog = array_slice($log, $start, $maxLine);	
		// add data
		$json['lastLine'] = $start + count($rangeLog);
		
		
		if( count($rangeLog) > 0 ) {
			$json['entries'] = $rangeLog;
		}
		else {
			$json['entries'] = array();
			$json['maxLog'] = $maxLog;
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