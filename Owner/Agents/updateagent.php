<?php
include "../../dbconnection.php";

$id = $_POST['id'];
$name = $_POST['name'];
$age = $_POST['age'];
$commission = $_POST['commission'];
$area = $_POST['area'];
$status = $_POST['status'];

$query = "UPDATE agents SET AgentName=?, Age=?, CommissionPercent=?, Area=?, Status=? WHERE AgentID=?";
$stmt = $connection->prepare($query);
$stmt->bind_param("sidssi", $name, $age, $commission, $area, $status, $id);
$stmt->execute();
?>
