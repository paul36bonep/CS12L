<?php

include "dbconnection.php";

$query = "SELECT BankID, BankName FROM bank";
$result = $connection->query($query);

$banknames = [];
while($row = $result->fetch_assoc()) {
    $banknames[] = [
        "bankId" => $row["BankID"],
        "bankName" => $row["BankName"]
    ];
}

header('Content-Type: application/json');
echo json_encode($banknames);

?>