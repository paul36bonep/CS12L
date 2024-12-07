<?php
    $connection = new mysqli("localhost","root","","SCTS");

    if($connection -> connect_error){
        die("Database Connection Error".$connection->connect_error);
    }
?>