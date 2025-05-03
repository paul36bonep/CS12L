<?php

include "reusables.php";
include "dbconnection.php";


//Login
if (isset($_POST['login'])) {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {

        echo "<script>alert('Please fill the required fields!')</script>";
        echo "<script> window.location.href='../Login/Login.php'</script>";

    } else {

        $query = "SELECT * FROM users WHERE username = '$username'";
        $result = mysqli_query($connection,$query);

        if($result->num_rows > 0){

            $row = mysqli_fetch_array($result);
            
            if(password_verify($password,$row["Password"])){

                $_SESSION['username'] = $username;
                $position = $row['PositionID'];

                switch ($position) {
                    case 1:
                        $_SESSION['position'] = 'Owner';
                        $_SESSION['name'] = $row['Name'];
                        header("Location:Owner/Main_Page/Main_Page.html");
                        break;

                    case 2:
                        $_SESSION['position'] = 'Admin'; 
                        $_SESSION['name'] = $row['Name'];                     
                        header("Location:Admin/Main_Page/Main_Page.html");
                        break;

                    case 3:
                        $_SESSION['position'] = 'Unit Manager';
                        $_SESSION['name'] = $row['Name'];
                        header("Location:Unit_Manager/Main_Page/Main_Page.html");
                        break;

                    default:
                        session_start();
                        session_unset();
                        session_destroy();
                        echo "<script>alert('Unknown User Log in')</script>";
                        echo "<script> window.location.href='Login/Login.html'</script>";
                        $connection->close();
                        break;
                    }

            }else{

                echo "<script>alert('Invalid Password')</script>";
                echo "<script> window.location.href='Login/Login.html'</script>";
                $connection->close();

            }
          
        }else{

            echo "<script>alert('Invalid Username')</script>";
            echo "<script> window.location.href='Login/Login.html'</script>";
            $connection->close();
        }

        $connection->close();
    }
}

?>