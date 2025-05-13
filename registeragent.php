<?php
include "dbconnection.php";
include "reusables.php";


if(isset($_POST['register'])){

    $name = $_POST['agentname'];

    if(isExistingInAgents($name) ){ 

        echo "<script>alert('This agent is already registered.')</script>";
        echo "<script> window.location.href='Owner/Agents/Agents.html'</script>";

    }else{ 

        $age = $_POST['age'];
        $commissionpercent = $_POST['commissionpercent'];
        $area = $_POST['area'];
        $status = ($_POST['status'] === "Active") ? 1 : 0;
        
        $query = "INSERT INTO agents(`AgentID`, `AgentName`, `Age`, `CommissionPercent`, `Area`, `Status`) 
                            VALUES ('','$name','$age','$commissionpercent','$area','$status')";
        
        mysqli_query($connection,$query);
        $connection -> close();

        echo "<script>alert('Agent is now registered.')</script>";
        echo "<script> window.location.href='Owner/Agents/Agents.html'</script>";

    }
}


?>