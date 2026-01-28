<?php

	$inData = getRequestInfo();
	$action = $inData["action"];

	$conn = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

	switch($action)
	{
		case "add":
			addContact($conn, $inData);
			break;
		case "get":
			getContacts($conn, $inData);
			break;
		case "update":
			updateContact($conn, $inData);
			break;
		case "delete":
			deleteContact($conn, $inData);
			break;
		default:
			returnWithError("Invalid action");
	}

	$conn->close();

	function addContact($conn, $inData)
	{
		$firstName = trim($inData["firstName"]);
		$lastName = trim($inData["lastName"]);
		$phone = trim($inData["phone"]);
		$email = trim($inData["email"]);
		$userID = $inData["userID"];

		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
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

	function getContacts($conn, $inData)
	{
		$userID = $inData["userID"];

		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE UserID = ?");
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

	function updateContact($conn, $inData)
	{
		$id = $inData["id"];
		$firstName = trim($inData["firstName"]);
		$lastName = trim($inData["lastName"]);
		$phone = trim($inData["phone"]);
		$email = trim($inData["email"]);

		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
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

	function deleteContact($conn, $inData)
	{
		$id = $inData["id"];

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