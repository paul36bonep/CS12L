<?php

include "dbconnection.php";

$query = "SELECT TypeID, CardType FROM cardtype";
$result = $connection->query($query);

$cardtypes = [];
while($row = $result->fetch_assoc()) {
    $cardtypes[] = [
        "cardTypeId" => $row["TypeID"],
        "cardTypeName" => $row["CardType"]
    ];
}

header('Content-Type: application/json');
echo json_encode($cardtypes);

?>