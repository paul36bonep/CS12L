<?php
include "dbconnection.php";
include "reusables.php";


if(isset($_POST['register'])){

    $username = trim($_POST['username']);

    if(isExistingInUsers($username)){ //|| isExistingInAgents($username)

        echo "<script>alert('Username is already taken.')</script>";
        echo "<script> window.location.href='registration.html'</script>";

    }else{

        $name = $_POST['name'];
        $position = $_POST['position'];
        $password = trim($_POST['password']);
        $hash = passwordHashing($password);

        switch($position){ //Assign PositionID for database

            case "Admin":
                $posID = 2;
                break;

            case "Owner":
                $posID = 1;
                break;

            default:
        }
        
        $query = "INSERT INTO users(`UserID`, `PositionID`, `UserName`, `Password`, `Name`, `Status`) 
                            VALUES ('','$posID','$username','$hash','$name','1')";
        
        mysqli_query($connection,$query);
        $connection -> close();

        echo "<script>alert('Username: {$username} is now registered.')</script>";
        echo "<script> window.location.href='index.php'</script>";

    }
}

?>