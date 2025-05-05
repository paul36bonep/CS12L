<?php

include "resuables.php";
include "dbconnection.php";


header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

foreach ($data as $line) {
    
}

$connection -> close();
echo json_encode(["message" => "Commission lines saved."]);

?>