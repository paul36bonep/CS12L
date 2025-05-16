<?php
header('Content-Type: application/json');
include "../../dbconnection.php";

if (!isset($_GET["cardId"])) {
    echo json_encode(["success" => false, "message" => "Card ID is required"]);
    exit;
}

$cardId = intval($_GET["cardId"]);

$stmt = $connection->prepare("
    SELECT card.CardID, card.TypeID, card.BankID, card.Amount, card.Status
    FROM card
    WHERE card.CardID = ?
");
$stmt->bind_param("i", $cardId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Card not found"]);
    exit;
}

$card = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "card" => [
        "cardId" => $card["CardID"],
        "cardTypeId" => $card["TypeID"],
        "bankId" => $card["BankID"],
        "amount" => $card["Amount"],
        "status" => $card["Status"] == 1 ? "Active" : "Inactive"
    ]
]);

$stmt->close();
$connection->close();
?>
