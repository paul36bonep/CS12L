<?php
    include "dbconnection.php";
    include "reusables.php";

    if(isset($_POST['addcardtype'])){

        $cardtypename = $_POST['newcardtype'];

        if(empty($cardtypename) || $cardtypename == "Enter card type"){

            echo "<script>alert('Please enter cardtype')</script>";
            echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";

        }else{
    
            if(isExistingInCardTypes($cardtypename)){
                
                echo "<script>alert('Card Type already Exists in the database.')</script>";
                echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";
                
            }else{

                $query = "INSERT INTO `cardtype` (`TypeID`, `CardType`) VALUES ('','$cardtypename')";
        
                mysqli_query($connection,$query);
                $connection -> close();

                unset($_POST['addcardtype']);
                echo "<script>alert('Card added Successfully')</script>";
                echo "<script> window.location.href='Owner/Cards/Cards.html'</script>";
            }
        }
    }
?>