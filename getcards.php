<?php

include "dbconnection.php";

$query = "SELECT card.CardID,
cardtype.CardType,
bank.BankName,
card.Amount
FROM card
JOIN cardtype ON card.TypeID = cardtype.TypeID
JOIN bank ON card.BankID = bank.BankID";

$result = $connection->query($query);

$cards = [];
while($row = $result->fetch_assoc()) {
    $cards[] = [
        "cardId" => $row["CardID"],
        "bankName" => $row["BankName"],
        "cardType" => $row["CardType"],
        "cardAmount" => $row["Amount"]
    ];
}

$connection->close();
header('Content-Type: application/json');
echo json_encode($cards);

?>