<?php

        $inputData = getRequestInfo();
        $connection = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

        // Declares and Sets Up Contact Detail Variables
		$id = $inputData["id"];
		$firstName = trim($inputData["firstName"]);
		$lastName = trim($inputData["lastName"]);
		$phone = trim($inputData["phone"]);
		$email = trim($inputData["email"]);

		// Sets, Prepares, and Executes Contact Update SQL Statement to DB
		$sqlStatement = $connection->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$sqlStatement->bind_param("ssssi", $firstName, $lastName, $phone, $email, $id);

		// Condition Statement that Checks if Execution was Successful
		if($sqlStatement->execute())
		{
			// Returns Updated Contact Info
			returnWithInfo($id, $firstName, $lastName, $phone, $email, 0);
		}
		else // Execution Failed
		{
			// Returns Error Message
			returnWithError("Failed to update contact");
		}

		$sqlStatement->execute();

		if ($sqlStatement->affected_rows > 0) {
    		// Fetch the actual userID from the contact row before update
    		$result = $connection->query("SELECT UserID FROM Contacts WHERE ID = $id");
    		$row = $result->fetch_assoc();
    		$userID = $row['UserID'];
    
    		returnWithInfo($id, $firstName, $lastName, $phone, $email, $userID);
		} 
		else {
   			returnWithError("No contact found with that ID");
		}

		// Closes Statement
		$sqlStatement->close();
        $connection->close();

    // Function that Retrieves Input Data from Request
	function getRequestInfo()
	{
		// Retrieve, Decodes, and Returns JSON Input Data
		return json_decode(file_get_contents('php://input'), true);
	}

    // Function that Returns with Contact Info
	function returnWithInfo($id, $firstName, $lastName, $phone, $email, $userID)
	{
		// Constructs and Sends Contact Info JSON Object
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","userID":' . $userID . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

    function returnWithError($err)
	{
		// Constructs and Sends Error JSON Object
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

    // Function that Sends Result Info as JSON
	function sendResultInfoAsJson($obj)
	{
		// Sets Header and Echoes JSON Object
		header('Content-type: application/json');
		echo $obj;
	}


?>
