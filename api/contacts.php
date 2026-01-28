<?php

    // Declares and Sets Up Input Data and Action Variable
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

    // Function that Adds Contact to DB
	function addContact($connection, $inputData)
	{

        // Declares and Sets Up Contact Detail Variables
		$firstName = trim($inputData["firstName"]);
		$lastName = trim($inputData["lastName"]);
		$phone = trim($inputData["phone"]);
		$email = trim($inputData["email"]);
		$userID = $inputData["userID"];

		// 
		$stmt = $connection->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userID);
		if($stmt->execute())
		{
			returnWithInfo($stmt->insert_id, $firstName, $lastName, $phone, $email, $userID);
		}
		else
		{
			returnWithError("Failed to add contact");
		}
		$stmt->close();
	}

	function getContacts($connection, $inputData)
	{
		$userID = $inputData["userID"];

		$stmt = $connection->prepare("SELECT ID, FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE UserID = ?");
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$result = $stmt->get_result();

		$searchCount = 0;
		$contacts = array();

		while($row = $result->fetch_assoc())
		{
			array_push($contacts, $row);
			$searchCount++;
		}

		if($searchCount > 0)
		{
			returnWithInfoList($contacts);
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
	}

	function updateContact($connection, $inputData)
	{
		$id = $inputData["id"];
		$firstName = trim($inputData["firstName"]);
		$lastName = trim($inputData["lastName"]);
		$phone = trim($inputData["phone"]);
		$email = trim($inputData["email"]);

		$stmt = $connection->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $id);
		if($stmt->execute())
		{
			returnWithInfo($id, $firstName, $lastName, $phone, $email, 0);
		}
		else
		{
			returnWithError("Failed to update contact");
		}
		$stmt->close();
	}

	function deleteContact($conn, $inputData)
	ection
	{
		$id = $inputData["id"];

		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
		$stmt->bind_param("i", $id);
		if($stmt->execute())
		{
			returnWithError("");
		}
		else
		{
			returnWithError("Failed to delete contact");
		}
		$stmt->close();
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

	function returnWithError($err)
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($id, $firstName, $lastName, $phone, $email, $userID)
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","userID":' . $userID . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfoList($contacts)
	{
		$retValue = '{"results":' . json_encode($contacts) . ',"error":""}';
		sendResultInfoAsJson($retValue);
	}

?>