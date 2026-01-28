<?php

    $inData = getRequestInfo();

    $firstName = trim($inData["firstName"]);
    $lastName = trim($inData["lastName"]);
    $login = trim($inData["login"]);
    $password = trim($inData["password"]);

    $conn = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}

    //checks to see if login (username) is in the database already
    $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->fetch_assoc()){
        returnWithError("Login already exists");
        $stmt->close();
        $conn->close();
        return;
    }
    $stmt->close();

    //insert new user
    $stmt = $conn->prepare(
    "INSERT INTO Users (FirstName, LastName, Login, Password)
     VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
    if($stmt->execute()){
        $stmt->insert_id;
        returnWithInfo($firstName, $lastName, $stmt->insert_id, date("Y-m-d H:i:s"));
    }
    else
        returnWithError("Failed to create user");
    $stmt->close();
    $conn->close();

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo( $firstName, $lastName, $id, $DateCreated )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","dateCreated":"' . $DateCreated . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>