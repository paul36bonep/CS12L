<?php

include "dbconnection.php";


//Login
if (isset($_POST['login'])) {

    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($username) || empty($password)) {

        echo "<script>alert('Please fill the required fields!')</script>";
        echo "<script> window.location.href='index.php'</script>";

    } else {

        $query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
       
        $result = mysqli_query($connection,$query);
       
        if($result -> num_rows > 0){

            session_start();

            $_SESSION['username'] = $username;
            $_SESSION['password'] = $password;

            echo "hello {$username}";
            header("Location: testhomepage.php");

        }else{

            echo "Invalid Username or Password";
            echo "<br><a href= 'index.html'> Go back to Log in Page </a>";
        }

        $connection->close();
    }
}

?>