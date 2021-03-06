<?php
$dir = 'D:/SteamLibrary/steamapps/common/7 Days To Die/7DaysToDie_Data/';
$sqlhost = '127.0.0.1';
$sqluser = 'sdtdUser';
$sqlpass = 'sdtdPass';
$sqldb = 'sdtd';
$sqltable = 'deathcount';

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
	$stat = array();
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
			elseif( preg_match("/^Setting for '/", $msg) !== 0) {
				$tmpSplit = preg_split ("/^Setting for '/", $msg);
				$tmpSplit = preg_split ("/'/", $tmpSplit[1]);
				$prefName = $tmpSplit[0];
				$tmpSplit = preg_split ("/= /", $tmpSplit[1]);
				$tmpSplit = preg_split ("/, /", $tmpSplit[1]);
				$prefValue = $tmpSplit[0];
				$game[$prefName] = $prefValue;
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
				$stat[$param] = $value[0];
			}
			
			$tmp = preg_split ("#\r\n$#", $line);
			$other[] = $tmp[0];
		}
	}
	return array('game' => $game, 'gamestat' => $stat, 'hardware' => $hardware, 'log' => $log, 'other' => $other, 'system' => $system);
}



function sqlQuery($sqlhost, $sqluser, $sqlpass, $sqldb, $sqltable){
	$mysqli = new mysqli($sqlhost, $sqluser, $sqlpass, $sqldb);
	if ($mysqli->connect_errno) {
		return array('error' => true, 'message' => "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}
	else{
		$entries = array();
		$res = $mysqli->query("SELECT * FROM ".$sqltable);
		$res->data_seek(0);
		while ($row = $res->fetch_assoc()) {
			$entries[] = array('world' => $row["world"], 'death' => $row["death"]);
		}
		if(count($entries) == 0){
			return array('entries' => $entries, 'error' => true, 'message' => "no entries");
		}
		else{
			return array('entries' => $entries, 'error' => false);
		}
	}
}

function sqlInsert($sqlhost, $sqluser, $sqlpass, $sqldb, $sqltable, $world, $death){
	$mysqli = new mysqli($sqlhost, $sqluser, $sqlpass, $sqldb);
	if ($mysqli->connect_errno) {
		return array('error' => true, 'message' => "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	}
	else{
		$res = $mysqli->query("INSERT INTO ".$sqltable." (world, death) VALUES ('".$world."', ".$death.") ON DUPLICATE KEY UPDATE death=".$death);
		return array('error' => false);
	}
}

?>