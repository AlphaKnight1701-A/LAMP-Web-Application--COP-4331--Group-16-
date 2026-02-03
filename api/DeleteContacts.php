<?php

    $inputData = getRequestInfo();
    $connection = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

    // Validate required field
    if (!isset($inputData["id"])) {
        returnWithError("Missing contact ID");
        exit();
    }

    $id = $inputData["id"];

    if ($connection->connect_error)
    {
        returnWithError($connection->connect_error);
    }
    else
    {
        // Prepare DELETE
        $sqlStatement = $connection->prepare("DELETE FROM Contacts WHERE ID = ?");
        $sqlStatement->bind_param("i", $id);

        if (!$sqlStatement->execute()) {
            returnWithError("SQL Error: " . $sqlStatement->error);
            exit();
        }

        // Check if a row was actually deleted
        if ($sqlStatement->affected_rows > 0) {
            returnWithInfo($id);
        } else {
            returnWithError("No contact found with that ID");
        }

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

    function returnWithInfo($id)
    {
        $retValue = '{"id":' . $id . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

?>