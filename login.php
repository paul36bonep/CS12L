<?php

include "reusables.php";
include "dbconnection.php";


//Login
if (isset($_POST['login'])) {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {

        echo "<script>alert('Please fill the required fields!')</script>";
        echo "<script> window.location.href='../Login/Login.html'</script>";

    } else {

        $query = "SELECT * FROM users WHERE username = '$username'";
        $result = mysqli_query($connection,$query);

        if($result->num_rows > 0){

            $row = mysqli_fetch_array($result);
            
            if(password_verify($password,$row["Password"])){

                $_SESSION['username'] = $username;
                header("Location:Owner/Main_Page/Main_Page.html");

                $position = $row["PositionID"];
                
                switch ($position) {
                    case 1:
                        $_SESSION["name"] = $row['Name'];
                        $_SESSION["position"] = "Owner";
                        header("Location:Owner/Main_Page/Main_Page.html");
                        break;

                    case 2:
                        $_SESSION["name"] = $row['Name'];
                        $_SESSION["position"] = "Admin";
                        header("Location:Admin/Main_Page/Main_Page.html");
                        break;

                    case 3:
                        $_SESSION["name"] = $row['Name'];
                        $_SESSION["position"] = "Unit Manager";
                        header("Location:Unit_Manager/Main_Page/Main_Page.html");
                        break; 

                    default:
                        session_start();
                        session_unset();
                        session_destroy();
                        $connection->close();
                        echo "<script>alert('Unknown User')</script>";
                        echo "<script> window.location.href='Login/Login.html'</script>";
                        break;
                }
           
            }else{

                echo "Invalid Password";
                echo "<br><a href= 'Login/Login.html'> Go back to Log in Page </a>";
                $connection->close();
            }
          
        }else{

            echo "Invalid Username";
            echo "<br><a href= 'Login/Login.html'> Go back to Log in Page </a>";
            $connection->close();
        }

        $connection->close();
    }
}

?>