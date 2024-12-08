<?php
include "dbconnection.php";
include "reusables.php";


if(isset($_POST['register'])){

    $table = "users";
    $username = $_POST['username'];

    if( isExisting($username,$table)){

        echo "<script>alert('Username is already taken.')</script>";
        echo "<script> window.location.href='registration.html'</script>";

    }else{

        $name = $_POST['name'];
        $position = $_POST['position'];
        $password = $_POST['password'];

        switch($position){ //Assign PositionID for database

            case "Admin":
                $posID = 2;
                break;

            case "Owner":
                $posID = 1;
                break;

            default:
        }

        $query = "INSERT INTO users(`userID`, `positionID`, `username`, `password`, `name`, `status`) 
                  VALUES ('',$posID,'$username','$password','$name','0')";
        
        mysqli_query($connection,$query);
        $connection -> close();

        echo "<script>alert('Username: {$username} is now registered.')</script>";
        echo "<script> window.location.href='index.html'</script>";

    }

}

?>