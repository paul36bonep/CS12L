<?php
include "../../dbconnection.php";

$id = $_POST['id'];

$query = "DELETE FROM agents WHERE AgentID=?";
$stmt = $connection->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
?>
