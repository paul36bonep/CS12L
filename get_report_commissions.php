<?php
include "dbconnection.php";
header('Content-Type: application/json');

$query = "
SELECT 
    c.CommissionID,
    c.CreatedAt AS transaction_date,
    a.AgentName AS agent,
    a.CommissionPercent AS commission_rate,
    c.TotalCommission AS commission_total,
    c.ApprovalStatus,
    SUM(cl.TotalAmount) AS total_sales
FROM commissions c
JOIN agents a ON c.AgentID = a.AgentID
LEFT JOIN commissions_lines cl ON c.CommissionID = cl.CommissionID
WHERE c.ApprovalStatus = 'Approved'
GROUP BY c.CommissionID
ORDER BY c.CreatedAt DESC
";
$result = $connection->query($query);

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
echo json_encode($rows);
$connection->close();
?>