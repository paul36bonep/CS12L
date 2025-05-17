<?php
// filepath: c:\xampp\htdocs\SCTS\updatecommission.php
include "dbconnection.php";
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['CommissionID']) || !is_array($data['lines'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid data']);
    exit();
}

$commissionId = intval($data['CommissionID']);
$lines = $data['lines'];

// Example: update commission info (add more fields as needed)
$agentID = $lines[0]['agentID'];
$totalCommission = floatval($lines[0]['totalComm']);
$connection->query("UPDATE commissions SET AgentID=$agentID, TotalCommission=$totalCommission WHERE CommissionID=$commissionId");

// Delete old lines and insert new ones
$connection->query("DELETE FROM commissions_lines WHERE CommissionID=$commissionId");
foreach ($lines as $line) {
    $cardId = $connection->real_escape_string($line['cardId']);
    $clientName = $connection->real_escape_string($line['clientName']);
    $quantity = floatval($line['quantity']);
    $amount = floatval($line['amount']);
    $total = floatval($line['total']);
    $totalComm = floatval($line['totalComm']);
    $connection->query("INSERT INTO commissions_lines (CommissionID, CardID, ClientName, Quantity, Amount, Total, TotalComm) VALUES ($commissionId, '$cardId', '$clientName', $quantity, $amount, $total, $totalComm)");
}

echo json_encode(['message' => 'Commission updated successfully']);
$connection->close();
?>