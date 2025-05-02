<?php
session_start();
if (!isset($_SESSION['user']) || strtolower($_SESSION['user']['PositionName']) !== 'owner') {
    header("Location: ../login.html");
    exit();
}
?>
<h2>Welcome Owner: <?= $_SESSION['user']['Name'] ?></h2>
<a href="../logout.php">Logout</a>
