<?php
include "dbconnection.php";
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$commissionId = intval($data['CommissionID']);

if ($commissionId) {
    // Delete commission lines first (if you have a foreign key constraint)
    $connection->query("DELETE FROM commissions_lines WHERE CommissionID = $commissionId");
    // Then delete the commission
    $connection->query("DELETE FROM commissions WHERE CommissionID = $commissionId");
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid CommissionID']);
}
$connection->close();
?>