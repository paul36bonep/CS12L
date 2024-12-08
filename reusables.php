<?php
   session_start();

function isExisting($username,$table){ //checks if the username already exists in the database.

    include "dbconnection.php";

    $query = "SELECT * FROM $table WHERE username = '$username'";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

        $connection->close();
        return true;

    }
}

function checkExistingSession(){

    if(isset($_SESSION['username'])){
        return true;
    }

}

function calculateCommission(){


}


?>