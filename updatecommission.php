<?php

include "dbconnection.php";
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['CommissionID'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid data']);
    exit();
}

$commissionId = intval($data['CommissionID']);

if (isset($data['agentID']) && isset($data['totalCommission']) && isset($data['status'])) {
    // Admin: update all fields
    $agentID = $connection->real_escape_string($data['agentID']);
    $totalCommission = floatval($data['totalCommission']);
    $status = $connection->real_escape_string($data['status']);

    $result = $connection->query("UPDATE commissions SET AgentID='$agentID', TotalCommission='$totalCommission', ApprovalStatus='$status' WHERE CommissionID=$commissionId");
} elseif (isset($data['status'])) {
    // Owner: update only status
    $status = $connection->real_escape_string($data['status']);
    $result = $connection->query("UPDATE commissions SET ApprovalStatus='$status' WHERE CommissionID=$commissionId");
} else {
    http_response_code(400);
    echo json_encode(['message' => 'No valid data']);
    exit();
}

if ($result) {
    echo json_encode(['message' => 'Commission updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to update commission']);
}
$connection->close();
?>