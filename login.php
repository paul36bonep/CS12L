<?php
include "reusables.php";
include "dbconnection.php";

if (isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        echo "<script>alert('Please fill the required fields!'); window.location.href='Login/Login.html';</script>";
        exit();
    } else {
        // Get user regardless of status
        $query = "SELECT * FROM users WHERE username = '$username'";
        $result = mysqli_query($connection, $query);

        if ($result && $result->num_rows > 0) {
            $row = mysqli_fetch_array($result);

            if (password_verify($password, $row["Password"])) {
                if ($row["Status"] == 1) {
                    // Successful login
                    session_start();
                    $_SESSION['username'] = $username;
                    $_SESSION["name"] = $row['Name'];
                    $_SESSION["UserID"] = $row['UserID'];
                    $_SESSION["positionID"] = $row["PositionID"];
                    // Set position string
                    switch ($row["PositionID"]) {
                        case 1:
                            $_SESSION["position"] = "Owner";
                            $redirect = "Owner/Main_Page/Main_Page.html";
                            break;
                        case 2:
                            $_SESSION["position"] = "Admin";
                            $redirect = "Admin/Main_Page/Main_Page.html";
                            break;
                        case 3:
                            $_SESSION["position"] = "Unit Manager";
                            $redirect = "Unit_Manager/Main_Page/Main_Page.html";
                            break;
                        default:
                            session_unset();
                            session_destroy();
                            echo "<script>alert('Unknown User'); window.location.href='Login/Login.html';</script>";
                            exit();
                    }
                    echo "<script>alert('Login successful! Redirecting to your dashboard...'); window.location.href='$redirect';</script>";
                    exit();
                } else {
                    // Inactive user
                    echo "<script>alert('Your account is inactive. Please contact the administrator.'); window.location.href='Login/Login.html';</script>";
                    exit();
                }
            } else {
                echo "<script>alert('Incorrect password. Please try again.'); window.location.href='Login/Login.html';</script>";
                exit();
            }
        } else {
            echo "<script>alert('Username not found. Please check your username and try again.'); window.location.href='Login/Login.html';</script>";
            exit();
        }
    }
}
?>