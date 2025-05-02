<?php
session_start();
$conn = new mysqli("localhost", "root", "", "scts");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];
    $password = $_POST['password']; // assuming plaintext for now, you can hash it later

    $stmt = $conn->prepare("SELECT users.UserID, users.UserName, users.Name, positions.PositionName
                            FROM users
                            JOIN positions ON users.PositionID = positions.PositionID
                            WHERE users.UserName = ? AND users.Password = ? AND users.Status = 1");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $_SESSION['users'] = $user;

        echo json_encode([
          'success' => true,
          'role' => strtolower($user['PositionName']) // normalize role
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials or inactive user']);
    }
}
?>




