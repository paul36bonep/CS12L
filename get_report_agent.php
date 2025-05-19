<?php
include "dbconnection.php";
header('Content-Type: application/json');

$agentId = isset($_GET['agentId']) ? $_GET['agentId'] : null;

if ($agentId && $agentId !== "all") {
    $query = "
    SELECT 
        c.CreatedAt AS transaction_date,
        cl.ClientName AS client_name,
        CONCAT(b.BankName, ' ', ct.CardType) AS card,
        cl.Amount AS amount,
        cl.Quantity AS quantity,
        cl.TotalAmount AS total
    FROM commissions c
    JOIN commissions_lines cl ON c.CommissionID = cl.CommissionID
    JOIN card cd ON cl.CardID = cd.CardID
    JOIN bank b ON cd.BankID = b.BankID
    JOIN cardtype ct ON cd.TypeID = ct.TypeID
    WHERE c.AgentID = ?
    ORDER BY c.CreatedAt DESC
    ";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $query = "
    SELECT 
        c.CreatedAt AS transaction_date,
        cl.ClientName AS client_name,
        CONCAT(b.BankName, ' ', ct.CardType) AS card,
        cl.Amount AS amount,
        cl.Quantity AS quantity,
        cl.TotalAmount AS total
    FROM commissions c
    JOIN commissions_lines cl ON c.CommissionID = cl.CommissionID
    JOIN card cd ON cl.CardID = cd.CardID
    JOIN bank b ON cd.BankID = b.BankID
    JOIN cardtype ct ON cd.TypeID = ct.TypeID
    ORDER BY c.CreatedAt DESC
    ";
    $result = $connection->query($query);
}

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows);
if (isset($stmt)) $stmt->close();
$connection->close();
?>