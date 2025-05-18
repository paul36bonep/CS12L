<?php
include "../../dbconnection.php";
var_dump($_POST);

$id = $_POST['id'];
$name = $_POST['agentname'];
$age = $_POST['age'];
$commission = $_POST['commissionpercent'];
$area = $_POST['area'];
$status = ($_POST['status'] === "Active") ? 1 : 0;

$query = "UPDATE agents SET AgentName=?, Age=?, CommissionPercent=?, Area=?, Status=? WHERE AgentID=?";
$stmt = $connection->prepare($query);
$stmt->bind_param("sidssi", $name, $age, $commission, $area, $status, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Agent updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>
