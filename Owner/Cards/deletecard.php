<?php
include "../../dbconnection.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["cardId"])) {
    echo json_encode(["success" => false, "message" => "Card ID is required"]);
    exit;
}

$cardId = $data["cardId"];

// Soft delete: set is_hidden = 1
$stmt = $connection->prepare("UPDATE card SET is_hidden = 1 WHERE CardID = ?");
$stmt->bind_param("i", $cardId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete card"]);
}

$stmt->close();
$connection->close();
?>
