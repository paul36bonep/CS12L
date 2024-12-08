<?php
    include "reusables.php";

    if(!checkExistingSession()){

        header("location:index.php");

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

    <h1>Hello</h1>
    <?php
        echo $_SESSION["username"];
    ?>
    <button onclick="window.location.href='logout.php'">Logout</button>
    
</body>
</html>
