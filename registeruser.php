<?php
include "dbconnection.php";
include "reusables.php";

header("Content-Type: application/json"); // Return JSON

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $username = trim($_POST['username']);

    if (isExistingInUsers($username)) {
        $response['success'] = false;
        $response['message'] = "Username is already taken.";
    } else {
        $name = $_POST['username'];
        $position = $_POST['position'];
        $password = trim($_POST['password']);
        $hash = passwordHashing($password);

        switch ($position) {
            case "Admin":
                $posID = 2;
                break;
            case "Owner":
                $posID = 1;
                break;
            case "Unit Manager":
                $posID = 3;
                break;
            default:
                $response['success'] = false;
                $response['message'] = "Undefined Position name.";
                echo json_encode($response);
                exit;
        }
        $status = $_POST['status'] === 'Inactive' ? 0 : 1;
        $query = "INSERT INTO users (`UserID`, `PositionID`, `UserName`, `Password`, `Name`, `Status`) 
                  VALUES ('', '$posID', '$username', '$hash', '$name', '$status')";

        if (mysqli_query($connection, $query)) {
            $response['success'] = true;
            $response['message'] = "User registered successfully.";
        } else {
            $response['success'] = false;
            $response['message'] = "Database error: " . mysqli_error($connection);
        }

        $connection->close();
    }

    echo json_encode($response);
}
?>
