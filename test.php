<?php
$password = "adminpass";
$hashedPassword = password_hash(password: $password, algo: PASSWORD_DEFAULT);

echo "Hashed Pasword: " . $hashedPassword;
?>