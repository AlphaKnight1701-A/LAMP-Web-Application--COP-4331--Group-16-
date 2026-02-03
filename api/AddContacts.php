<?php
<?php

    $inData = getRequestInfo();
    
    $firstName = trim($inData["firstName"]);
    $lastName = trim($inData["lastName"]);
    $email = trim($inData["email"]);
    $phone = trim($inData["phone"]);
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES(?,?,?,?,?)");
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
?>