<?php
header('Content-Type: application/json');
include "dbconnection.php";
include "reusables.php";

// Read the raw JSON input
$data = json_decode(file_get_contents("php://input"), true);

$cardtypeid = $data['cardType'] ?? '';
$bankid = $data['bank'] ?? '';
$cardamount = $data['cardAmount'] ?? '';
$status = $data['status'];


// Validate fields
if (empty($cardamount) || empty($cardtypeid) || empty($bankid)) {
    echo json_encode([
        "success" => false,
        "message" => "Please enter all fields."
    ]);
    exit;
}

// Check if the card already exists
if (isExistingInCard($cardtypeid, $bankid)) {
    echo json_encode([
        "success" => false,
        "message" => "Card already exists in the database."
    ]);
    exit;
}

// Insert the new card into the database
$query = "INSERT INTO `card`(`TypeID`, `BankID`, `Amount`, `Status`) 
          VALUES ('$cardtypeid', '$bankid', '$cardamount', '$status')";

if (mysqli_query($connection, $query)) {
    echo json_encode([
        "success" => true,
        "message" => "Card added successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error adding card. Please try again."
    ]);
}

$connection->close();
?>
