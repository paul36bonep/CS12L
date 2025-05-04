<?php

include "dbconnection.php";

$query = "SELECT AgentID, AgentName, CommissionPercent FROM agents";
$result = $connection->query($query);

$agentnames = [];
while($row = $result->fetch_assoc()) {
    $agentnames[] = [
        "agentId" => $row["AgentID"],
        "agentName" => $row["AgentName"],
        "commissionRate" => $row["CommissionPercent"]
    ];
}

$connection ->close();
header('Content-Type: application/json');
echo json_encode($agentnames);

?>