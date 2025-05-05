<?php
    $connection = new mysqli("localhost","root",null,"scts",4306);

    if($connection -> connect_error){
        die("Database Connection Error".$connection->connect_error);
    }
?>