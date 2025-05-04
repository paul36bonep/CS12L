<?php
   session_start();

//checkers
function isExistingInCardTypes($cardtypename){

    include "dbconnection.php";

    $query = "SELECT * FROM cardtype WHERE LOWER(CardType) = LOWER('$cardtypename')";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

        $connection->close();
        return true;

    }else{

        $connection->close();
        return false;

    }
}

function isExistingInBank($bankname){

    include "dbconnection.php";

    $query = "SELECT * FROM bank WHERE LOWER(BankName) = LOWER('$bankname')";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

        $connection->close();
        return true;

    }else{

        $connection->close();
        return false;

    }
}

// function getTypeID($cardtype){

//     include "dbconnection.php";

//     $query = "SELECT TypeID FROM cardtype WHERE LOWER(CardType) = LOWER('$cardtype')";
//     $result = mysqli_query($connection,$query);
//     $typeid = null;

//     if ($row = mysqli_fetch_assoc($result)) {
//         $typeid = $row['TypeID'];
//     }

//     $connection->close();
//     return $typeid;

// }

// function getBankID($bankname){

//     include "dbconnection.php";
    
//     $query = "SELECT BankID FROM bank WHERE LOWER(BankName) = LOWER('$bankname')";
//     $result = mysqli_query($connection,$query);

//     $bankid = null;

//     if ($row = mysqli_fetch_assoc($result)) {
//         $bankid = $row['BankID'];
//     }

//     $connection->close();
//     return $bankid;
// }

function isExistingInCard($cardtypeid, $bankid){

    include "dbconnection.php";

    $query = "SELECT * FROM card WHERE TypeID = '$cardtypeid' AND BankID = '$bankid'";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

        $connection->close();
        return true;

    }else{

        $connection->close();
        return false;

    }

}

function isExistingInUsers($username){ //checks if the username already exists in the database.

    include "dbconnection.php";

    $query = "SELECT * FROM users WHERE LOWER(Username) = LOWER('$username')";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

        $connection->close();
        return true;

    }else{

        $connection->close();
        return false;

    }
}


function isExistingInAgents($name){ //checks if the username already exists in the database.

    include "dbconnection.php";

    $query = "SELECT * FROM agents WHERE LOWER(AgentName) = LOWER('$name')";
    $result = mysqli_query($connection,$query);

    if($result -> num_rows > 0){

         $connection->close();
         return true;

    }else{

        $connection->close();
        return false;

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
function addCard($cardid, $cardtypeid, $bankname, $amount){

    include "dbconnection.php";
    $query = "INSERT INTO card(`CardID`, `TypeID','BankID','Amount','Status') 
                            VALUES ('$cardid','$cardtypeid','$bankname','$amount','1')";
        
        mysqli_query($connection,$query);
        $connection -> close();

}

//Commissions
function createCommissionrequest($agentid, $cardid, $quantity){ // creating a commission request: for approval to owner
    include "dbconnection.php";

    $totalcommission = calculateCommission($quantity,$agentid, $cardid);
    $query = "INSERT INTO commissions(`CommissionID`, `UserID','AgentID','TotalCommission','ApprovalStatus') 
                            VALUES ('',$userid','$agentid','$totalcommission','2')";
    
    mysqli_query($connection,$query);
    $connection -> close();

} 

function createCommission($agentid, $cardid, $quantity){ //for owner only :no posting for approval

    include "dbconnection.php";
    $totalcommission = calculateCommission($quantity,$agentid, $cardid);
    $query = "INSERT INTO commissions(`CommissionID`, `UserID','AgentID','TotalCommission','ApprovalStatus') 
                            VALUES ('',$userid','$agentid','$totalcommission','1')";
    
    mysqli_query($connection,$query);
    $connection -> close();

}

function editCommission($commissionid){ // function for editing a commision details (Owner Only)

    include "dbconnection.php";

    $query = "SELECT * FROM commissions WHERE CommissionID = '$commissionid'";
    mysqli_query($connection,$query);


    $connection -> close();

    //unfinished

} 

function deleteCommission(){// might remove this

    include "dbconnection.php";

}

function approveCommission(){ // for approving commission (Owner Only)

    include "dbconnection.php";

} 


function calculateCommission($quantity,$agentid,$cardid){

    include "dbconnection.php";
    /*
    formula: [quantity(userinput) * amount(from cards) ] x Commissionpercent from agents table
    */

    $commissionPercent = "SELECT CommissionPercet FROM agents WHERE AgentID = '$agentid'";
    mysqli_query($connection,$query);

    $amount = "SELECT Amount FROM card WHERE CardID = '$cardid'";
    mysqli_query($connection,$query);

    $subtotal = $quantity * $amount;
    $totalCommission = $subtotal * ($commissionPercent / 100);

    $connection -> close();

    return $totalCommission;

}
?>