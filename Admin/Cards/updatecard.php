<?php
include "../../dbconnection.php";

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check for required fields
if (
    isset($data["cardId"]) &&
    isset($data["cardType"]) &&
    isset($data["bank"]) &&
    isset($data["cardAmount"]) &&
    isset($data["status"])
) {
    $cardId = $data["cardId"];
    $cardType = $data["cardType"];
    $bank = $data["bank"];
    $amount = $data["cardAmount"];
    $status = $data["status"];

    // Prepare and execute the update query
    $stmt = $connection->prepare("UPDATE card SET TypeID = ?, BankID = ?, Amount = ?, Status = ? WHERE CardID = ?");
    $stmt->bind_param("iisii", $cardType, $bank, $amount, $status, $cardId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Update failed."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}

$connection->close();
?>
