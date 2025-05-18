<?php

include "dbconnection.php";

// Query to get card details
$query = "SELECT card.CardID, cardtype.CardType, bank.BankName, card.Amount, card.Status
          FROM card
          JOIN cardtype ON card.TypeID = cardtype.TypeID
          JOIN bank ON card.BankID = bank.BankID
          WHERE card.is_hidden = 0";

$result = $connection->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database query failed"]);
    exit;
}

$cards = [];
while($row = $result->fetch_assoc()) {
    $cards[] = [
        "cardId" => $row["CardID"],
        "bankName" => $row["BankName"],
        "cardType" => $row["CardType"],
        "cardAmount" => $row["Amount"],
        "status" => $row["Status"] == 1 ? "Active" : "Inactive"
       
    ];
}

$connection->close();
header('Content-Type: application/json');
echo json_encode($cards);

?>
