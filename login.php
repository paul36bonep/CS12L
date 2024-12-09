<?php

include "reusables.php";
include "dbconnection.php";


//Login
if (isset($_POST['login'])) {

    $username = $_POST['username'];
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {

        echo "<script>alert('Please fill the required fields!')</script>";
        echo "<script> window.location.href='index.php'</script>";

    } else {

        $query = "SELECT * FROM users WHERE username = '$username'";
        $result = mysqli_query($connection,$query);

        if($result->num_rows > 0){

            $row = mysqli_fetch_array($result);
            

            if(password_verify($password,$row["Password"])){

                $_SESSION['username'] = $username;
                echo $_SESSION['username'];
                header("Location: testhomepage.php");
           
            }else{

                echo "Invalid Password";
                echo "<br><a href= 'index.php'> Go back to Log in Page </a>";

            }
          
        }else{

            echo "Invalid Username";
            echo "<br><a href= 'index.php'> Go back to Log in Page </a>";
        }

        $connection->close();
    }
}

?>