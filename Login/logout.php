<?php

    session_start();
    session_unset();
    session_destroy();

    echo "<script>alert('Log Out Sucessfully!')</script>";
    echo "<script> window.location.href='index.php'</script>";
?>