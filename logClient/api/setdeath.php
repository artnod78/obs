<?php
include 'api.php';

if( !isset($_GET["world"]) AND !isset($_GET["death"])) {
	$json = array('error' => true, 'message' => "need world and death param");
}


else if( !isset($_GET["world"]) AND isset($_GET["death"])) {
	$json = array('error' => true, 'message' => "need world param");
}

else if( isset($_GET["world"]) AND !isset($_GET["death"])) {
	$json = array('error' => true, 'message' => "need death param");
}
else{
	$json = sqlInsert($_GET["world"], $_GET["death"]);
	
}



header('Content-Type: application/json');
echo json_encode($json);
?>