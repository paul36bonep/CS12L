<?php

    include "reusables.php";

    if(checkExistingSession()){

        header("location: testhomepage.php");

    }
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="login.php" method="POST">
        
        <label> Enter Username</label><br>
        <input type="text" name="username">
        <br>
        <label> Enter Password</label><br>
        <input type="password" name="password">
        <br>
        <input type="submit" name="login" value="LogIn">
        
    </form>
    <button onclick="window.location.href='registration.html'" name="register" value="Register">Register</button>
    

</body>
</html>