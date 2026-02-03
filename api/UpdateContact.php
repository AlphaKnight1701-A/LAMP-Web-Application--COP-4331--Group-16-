<?php

    $inputData = getRequestInfo();
    $connection = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

    // Validate required fields
    if (
        !isset($inputData["firstName"]) ||
        !isset($inputData["lastName"]) ||
        !isset($inputData["email"]) ||
        !isset($inputData["phone"]) ||
        !isset($inputData["userId"])
    ) {
        returnWithError("Missing required fields");
        exit();
    }

    // Extract and sanitize
    $firstName = trim($inputData["firstName"]);
    $lastName  = trim($inputData["lastName"]);
    $email     = trim($inputData["email"]);
    $phone     = trim($inputData["phone"]);
    $userId    = $inputData["userId"];

    if ($connection->connect_error)
    {
        returnWithError($connection->connect_error);
    }
    else
    {
        // Prepare INSERT
        $sqlStatement = $connection->prepare(
            "INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?, ?, ?, ?, ?)"
        );

        $sqlStatement->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);

        if (!$sqlStatement->execute()) {
            returnWithError("SQL Error: " . $sqlStatement->error);
            exit();
        }

        // Get the new contact ID
        $newId = $connection->insert_id;

        // Return success object
        returnWithInfo($newId, $firstName, $lastName, $phone, $email, $userId);

        $sqlStatement->close();
        $connection->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithInfo($id, $firstName, $lastName, $phone, $email, $userId)
    {
        $retValue = '{"id":' . $id .
                    ',"firstName":"' . $firstName .
                    '","lastName":"' . $lastName .
                    '","phone":"' . $phone .
                    '","email":"' . $email .
                    '","userID":' . $userId .
                    ',"error":""}';

        sendResultInfoAsJson($retValue);
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>