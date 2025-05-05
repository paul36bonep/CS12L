<?php
    include "dbconnection.php";
    include "reusables.php";

    if(isset($_POST['addbank'])){

        $bankname = strtolower($_POST['newbankname']);

        if(empty($bankname) || $bankname == "Enter bank name"){

            echo "<script>alert('Please enter bank name')</script>";
            echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";

        }else{
    
            if(isExistingInBank($bankname)){
    
            echo "<script>alert('Bank already Exists in the database.')</script>";
            echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";
    
            }else{

                $query = "INSERT INTO `bank`(`BankID`, `BankName`) VALUES ('','$bankname')";
        
                mysqli_query($connection,$query);
                $connection -> close();
                unset($_POST['addbank']);

                echo "<script>alert('Card added Successfully')</script>";
                echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";
            }
        }
    }
?>