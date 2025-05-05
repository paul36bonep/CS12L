<?php

include "dbconnection.php";
session_start();

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);//{cardId,agentID,clientName,quantity,amount,total,totalComm}

if (!is_array($data) || count($data) === 0) {
    http_response_code(400);
    echo json_encode(['message' => 'No Commission lines added']);
    exit();
}

if (!isset($_SESSION['UserID'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized - No user session']);
    exit();
}

$userID = $_SESSION['UserID'];
$approval = "Pending";
$agentID = $data[0]['agentID'];
$totalCommission = floatval($data[0]['totalComm']);


$connection->begin_transaction();

try {
    // Insert into commissions table first 
    $query = "INSERT INTO `commissions`(`CommissionID`, `UserID`, `AgentID`, `TotalCommission`, `ApprovalStatus`) 
    VALUES ('','$userID','$agentID','$totalCommission','$approval')";
    mysqli_query($connection,$query);

    $commissionID = $connection->insert_id; //get the last added commID 

    // Insert each commission line to the database
    
    foreach ($data as $line) {
        $cardID = intval($line['cardId']);
        $clientName = $line['clientName'];
        $quantity = floatval($line['quantity']);
        $amount = floatval($line['amount']);
        $totalAmount = floatval($line['total']);

        $linequery = "INSERT INTO `commissions_lines`(`Coms_Lines`, `CommissionID`, `CardID`, `ClientName`, `Quantity`, `Amount`, `TotalAmount`) 
        VALUES ('','$commissionID','$cardID','$clientName','$quantity','$amount','$totalAmount')";
        mysqli_query($connection,$linequery);
    }

    $connection->commit();
    echo json_encode(['message' => 'Commission created successfully']);

} catch (Exception $e) {
    $connection->rollback();
    http_response_code(500);
    echo json_encode(['message' => 'Transaction failed', 'error' => $e->getMessage()]);
    
}
$connection->close();
?>