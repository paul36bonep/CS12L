<?php

include "dbconnection.php";
header('Content-Type: application/json');

$cardId = isset($_GET['cardId']) && $_GET['cardId'] !== "all_cards" ? intval($_GET['cardId']) : null;

if ($cardId) {
    $query = "
        SELECT 
            c.CreatedAt AS transaction_date,
            a.AgentName AS agent,
            CONCAT(b.BankName, ' ', ct.CardType) AS card,
            cl.ClientName AS client_name,
            cl.Amount AS amount,
            cl.Quantity AS quantity,
            cl.TotalAmount AS total
        FROM commissions c
        JOIN agents a ON c.AgentID = a.AgentID
        JOIN commissions_lines cl ON c.CommissionID = cl.CommissionID
        JOIN card cd ON cl.CardID = cd.CardID
        JOIN bank b ON cd.BankID = b.BankID
        JOIN cardtype ct ON cd.TypeID = ct.TypeID
        WHERE cl.CardID = ?
        ORDER BY c.CreatedAt DESC
    ";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $cardId);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // All cards
    $query = "
        SELECT 
            c.CreatedAt AS transaction_date,
            a.AgentName AS agent,
            CONCAT(b.BankName, ' ', ct.CardType) AS card,
            cl.ClientName AS client_name,
            cl.Amount AS amount,
            cl.Quantity AS quantity,
            cl.TotalAmount AS total
        FROM commissions c
        JOIN agents a ON c.AgentID = a.AgentID
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