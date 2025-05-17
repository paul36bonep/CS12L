<?php
// filepath: c:\xampp\htdocs\SCTS\getcommissions.php
include "dbconnection.php";
header('Content-Type: application/json');

// Adjust table/column names as needed for your schema
$query = "
    SELECT 
        c.CommissionID,
        c.AgentID,
        a.AgentName AS AgentName,
        c.TotalCommission,
        c.ApprovalStatus
    FROM commissions c
    LEFT JOIN agents a ON c.AgentID = a.AgentID
    ORDER BY c.CommissionID ASC
";

$result = $connection->query($query);

$commissions = [];
while ($row = $result->fetch_assoc()) {
    $commissions[] = $row;
}

echo json_encode($commissions);
$connection->close();
?>