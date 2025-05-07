<?php
include "dbconnection.php";

$query = "SELECT AgentID, AgentName, Age, CommissionPercent, Area, Status FROM agents";
$result = $connection->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch agents."]);
    exit;
}

$agents = [];
while($row = $result->fetch_assoc()) {
    $agents[] = [
        "id" => $row["AgentID"],
        "name" => $row["AgentName"],
        "age" => $row["Age"],
        "commission" => $row["CommissionPercent"],
        "area" => $row["Area"],
        "status" => $row["Status"]
    ];
}

header('Content-Type: application/json');
echo json_encode($agents);
?>
