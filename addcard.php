<?php
    include "dbconnection.php";
    include "reusables.php";

    if(isset($_POST['addcard'])){

        $cardtypeid = $_POST['cardtype'];
        $bankid = $_POST['bankname'];
        $cardamount = $_POST['cardamount'];


        if(empty($cardamount) || empty($cardtypeid) || empty($bankid)){ 

            echo "<script>alert('Please enter amount')</script>";
            echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";

        }else{
    
            if(isExistingInCard($cardtypeid,$bankid)){
    
                echo "<script>alert('Card already Exists in the database.')</script>";
                echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";
    
            }else{
                
                $query = "INSERT INTO `card`(`CardID`, `TypeID`, `BankID`, `Amount`, `Status`) VALUES ('','$cardtypeid','$bankid','$cardamount','1')";
        
                mysqli_query($connection,$query);
                $connection -> close();
                unset($_POST['addcard']);

                echo "<script>alert('Card added Successfully')</script>";
                echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";
            }
        }
    }
?>