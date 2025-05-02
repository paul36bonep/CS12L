<?php
$conn = new mysqli("localhost", "root", "", "scts");
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$userId = $_POST['userId'];
$position = $_POST['position'];
$username = $_POST['username'];
$password = $_POST['password'];
$name = $_POST['name'];
$status = $_POST['status'];

$sql = "INSERT INTO users (position, username, password, name, status)
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $position, $username, $password, $name, $status);


if ($stmt->execute()) {
  $newUserId = $conn->insert_id;
  echo "User registered successfully! User ID: " . $newUserId;
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
