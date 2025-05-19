<?php
include "../../dbconnection.php";

header('Content-Type: application/json');

$query = "
SELECT 
    users.UserID as id,
    positions.PositionName as position,
    users.UserName as username,
    users.Name as name,
    CASE users.Status 
        WHEN 1 THEN 'Active' 
        WHEN 0 THEN 'Inactive' 
        ELSE 'Unknown' 
    END as status
FROM users
JOIN positions ON users.PositionID = positions.PositionID
ORDER BY users.UserID
";

$result = $connection->query($query);
$users = [];

while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode($users);
$connection->close();
?>
