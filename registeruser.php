<?php
include "dbconnection.php";
include "reusables.php";


if(isset($_POST['register'])){

    $username = trim($_POST['username']);

    if(isExistingInUsers($username)){ //|| isExistingInAgents($username)

        echo "<script>alert('Username is already taken.')</script>";
        echo "<script> window.location.href='Owner/Users/Users.html'</script>";

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

            case "Unit Manager":
                $posID = 3;
                break;
    
            default:
                break;
        }

        $query = "INSERT INTO users(`UserID`, `PositionID`, `UserName`, `Password`, `Name`, `Status`) 
                            VALUES ('','$posID','$username','$hash','$name','1')";
        
        mysqli_query($connection,$query);
        $connection -> close();

        echo "<script>alert('User registered Successfully')</script>";
        echo "<script> window.location.href='Owner/Users/Users.html'</script>";

    }
}

?>