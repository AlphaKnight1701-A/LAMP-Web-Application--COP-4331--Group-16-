<?php

    // Declares and Sets Up Input Data Reference and Action Variable
	$inputData = getRequestInfo();
	$action = $inputData["action"];

    // Declares and Sets Up Database Connection
	$connection = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

    // Condition Statement that Checks for Connection Error
	if($connection->connect_error)
	{
        // Returns Connection Error
		returnWithError($connection->connect_error);
	}

    // Switch Statement that Calls Appropriate Action Function
	switch($action)
	{
		case "add": // Add Contact to DB
			addContact($connection, $inputData);
			break;
		case "get": // Get Contacts from DB
			getContacts($connection, $inputData);
			break;
		case "update": // Update Contact in DB
			updateContact($connection, $inputData);
			break;
		case "delete": // Delete Contact in DB
			deleteContact($connection, $inputData);
			break;
		default: // All Other Actions
			returnWithError("Invalid action");
	}

    // Closes Database Connection
	$connection->close();

    // Function that ADDS Contact to DB
	function addContact($connection, $inputData)
	{
        // Declares and Sets Up Contact Detail Variables
		$firstName = trim($inputData["firstName"]);
		$lastName = trim($inputData["lastName"]);
		$phone = trim($inputData["phone"]);
		$email = trim($inputData["email"]);
		$userID = $inputData["userID"];

		// Sets, Prepares, and Executes Contact Insertion SQL Statement to DB
		$sqlStatement = $connection->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		$sqlStatement->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);
		
		// Condition Statement that Checks if Execution was Successful
		if($sqlStatement->execute())
		{
			// Returns Contact Info with New Contact ID
			returnWithInfo($sqlStatement->insert_id, $firstName, $lastName, $phone, $email, $userID);
		}
		else // Execution Failed
		{
			// Returns Error Message
			returnWithError("Failed to add contact");
		}

		// Closes Statement
		$sqlStatement->close();
	}

	// Function that GETS Contacts from DB
	function getContacts($connection, $inputData)
	{
		// Declares and Sets Up UserID Variable from inputData
		$userID = $inputData["userID"];

		// Sets, Prepares, and Executes Contact Retrieval SQL Statement from DB
		$sqlStatement = $connection->prepare("SELECT ID, FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE UserID = ?");
		$sqlStatement->bind_param("i", $userID);

		// Executes the SQL Statement and Retrieves Result
		$sqlStatement->execute();
		$result = $sqlStatement->get_result();

		// Declares and Sets Up Search Count and Contacts Array
		$searchCount = 0;
		$contacts = array();

		// Loop that Iterates While there are Rows to Fetch
		while($row = $result->fetch_assoc())
		{
			// Pushes Fetched Row to Contacts Array and Increments Search Count
			array_push($contacts, $row);
			$searchCount++;
		}

		// Condition Statement that Checks if Any Contact Was Found
		if($searchCount > 0)
		{
			// Returns Contact List
			returnWithInfoList($contacts);
		}
		else // No Contacts Found
		{
			// Returns No Records Found Error
			returnWithError("No Records Found");
		}

		// Closes SQL Statement
		$sqlStatement->close();

	}

	// Function that UPDATES Contact in DB
	function updateContact($connection, $inputData)
	{
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

		// Closes Statement
		$sqlStatement->close();
	}

	// Function that DELETES Contact from DB
	function deleteContact($connection, $inputData)
	{
		// Declares and Sets Contact ID Variable
		$id = $inputData["id"];

		// Sets, Prepares, and Executes Contact Deletion SQL Statement to DB
		$sqlStatement = $connection->prepare("DELETE FROM Contacts WHERE ID = ?");
		$sqlStatement->bind_param("i", $id);

		// Condition Statement that Checks if Execution was Successful
		if($sqlStatement->execute())
		{
			// Returns with No/Empty Error
			returnWithError("");
		}
		else // Execution Failed
		{
			// Returns Error Message
			returnWithError("Failed to delete contact");
		}
		
		// Closes Statement
		$sqlStatement->close();
	}

	// Function that Retrieves Input Data from Request
	function getRequestInfo()
	{
		// Retrieve, Decodes, and Returns JSON Input Data
		return json_decode(file_get_contents('php://input'), true);
	}

	// Function that Sends Result Info as JSON
	function sendResultInfoAsJson($obj)
	{
		// Sets Header and Echoes JSON Object
		header('Content-type: application/json');
		echo $obj;
	}

	// Function that Returns with Error Message
	function returnWithError($err)
	{
		// Constructs and Sends Error JSON Object
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	// Function that Returns with Contact Info
	function returnWithInfo($id, $firstName, $lastName, $phone, $email, $userID)
	{
		// Constructs and Sends Contact Info JSON Object
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","userID":' . $userID . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

	// Function that Returns with Contact List
	function returnWithInfoList($contacts)
	{
		// Constructs and Sends Contact List JSON Object
		$retValue = '{"results":' . json_encode($contacts) . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

?>
