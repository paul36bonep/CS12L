<?php

include "dbconnection.php";

if (isset($_POST['login'])) {

    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($username) || empty($password)) {

        echo "<script>alert('Please fill the required fields!')</script>";
        echo "<script> window.location.href='index.html'</script>";

    } else {

        $query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
       
        $result = mysqli_query($connection,$query);
       
        if($result -> num_rows > 0){

            echo "hello {$username}";

        }else{

            echo "Invalid Username or Password";
            echo "<br><a href= 'index.html'> Go back to Log in Page </a>";
        }

        $connection->close();
    }

}

?>