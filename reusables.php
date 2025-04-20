<?php
   session_start();

function isExistingInUsers($username){ //checks if the username already exists in the database.

    include "dbconnection.php";

    $query = "SELECT * FROM users WHERE Username = '$username'";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

        $connection->close();
        return true;

    }
}

function isExistingInAgents($username){ //checks if the username already exists in the database.

     include "dbconnection.php";

     $query = "SELECT * FROM agents WHERE username = '$username'";
     $result = mysqli_query($connection,$query);

     if($result -> num_rows > 0){

         $connection->close();
         return true;

     }
 }

function sessionTimer(){ //checks for inactivity and timeout.

    $sessiontimer = 1800; // time in seconds

    if(isset($_SESSION['activity'])){ // 'activity' is set by computer time/real-time 

        $duration = time() - $_SESSION['activity'];
  
        if($duration > $sessiontimer){

            session_unset();
            session_destroy();

            echo "<script>alert('Session Timed Out! Please log in again.')</script>";
            echo "<script> window.location.href='index.php'</script>";
            exit;

        }
    }
    
    $_SESSION['activity'] = time();

}

function checkExistingSession(){ //checks if there is an existing session.

    if(isset($_SESSION['username'])){
        
        return true;

    }

}

function noSession(){ //checks if there are no sessions.

    if(!isset($_SESSION['username'])){
        
        echo "<script>alert('Please Log in.')</script>";
        echo "<script> window.location.href='index.php'</script>";
    }
}

function passwordHashing($password){ //encrpt the passowrds to be stored in database.

    $hash = password_hash($password,PASSWORD_DEFAULT);
    return $hash;
}


//Cards
function addCardtype($typeid,$cardtype){

    include "dbconnection.php";
    $query = "INSERT INTO cardtype(`TypeID`, `CardType') 
                            VALUES ('$typeid','$cardtype')";
        
        mysqli_query($connection,$query);
        $connection -> close();
    
}

function addBank($bankname){

    include "dbconnection.php";
    $query = "INSERT INTO bank(`BankID`, `BankName') 
                            VALUES ('','$bankname')";
        
        mysqli_query($connection,$query);
        $connection -> close();

}

function addCard($cardid, $cardtypeid,$bankname,$amount){

    include "dbconnection.php";
    $query = "INSERT INTO card(`CardID`, `TypeID','BankID','Amount','Status') 
                            VALUES ('$cardid','$cardtypeid','$bankname','$amount','1')";
        
        mysqli_query($connection,$query);
        $connection -> close();

}

//Commissions
function createCommissionrequest(){ // creating a commission request: for approval to owner

} 

function createCommission(){ //for owner only :no posting for approval


}

function approveCommission(){ // for approving commission (Owner Only)

} 


function editCommission(){ // function for editing a commision details (Owner Only)

} 


function calculateCommission(){
    /*
    formula: 
    */
}

?>