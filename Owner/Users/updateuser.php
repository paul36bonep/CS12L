<?php
include "../../dbconnection.php";

header("Content-Type: application/json");

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['userid'];
    $username = trim($_POST['username']);
    $name = $_POST['name'];
    $position = $_POST['position'];
    $status = $_POST['status'] === "Inactive" ? 0 : 1;

    switch ($position) {
        case "Admin": $posID = 2; break;
        case "Owner": $posID = 1; break;
        case "Unit Manager": $posID = 3; break;
        default:
            $response['success'] = false;
            $response['message'] = "Invalid position.";
            echo json_encode($response);
            exit;
    }

    $query = "UPDATE users SET 
                PositionID = '$posID',
                UserName = '$username',
                Name = '$name',
                Status = '$status'
              WHERE UserID = '$id'";

    if (mysqli_query($connection, $query)) {
        $response['success'] = true;
        $response['message'] = "User updated successfully.";
    } else {
        $response['success'] = false;
        $response['message'] = "Database error: " . mysqli_error($connection);
    }

    echo json_encode($response);
    $connection->close();
}
?>
