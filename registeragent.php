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
        $commissionpercent = $_POST['commissionpercent']/100;
        $area = $_POST['area'];
        
        $query = "INSERT INTO agents(`AgentID`, `AgentName`, `Age`, `CommissionPercent`, `Area`, `Status`) 
                            VALUES ('','$name','$age','$commissionpercent','$area','1')";
        
        mysqli_query($connection,$query);
        $connection -> close();

        echo "<script>alert('Agent is now registered.')</script>";
        echo "<script> window.location.href='Owner/Agents/Agents.html'</script>";

    }
}

?>