<?php
include "dbconnection.php";

header('Content-Type: application/json');

$result = $connection->query("SELECT MAX(CommissionID) AS latest FROM commissions");
$row = $result->fetch_assoc();
$latest = $row['latest'] ? intval($row['latest']) : 0;

echo json_encode(['latestCommissionId' => $latest]);
$connection->close();
?>