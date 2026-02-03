<?php

    $inputData = getRequestInfo();
    $connection = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");
	if( $connection->connect_error )
	{
		returnWithError( $connection->connect_error );
	}
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
    $connection->close();
    
    // Function that Returns with Contact List
	function returnWithInfoList($contacts)
	{
		// Constructs and Sends Contact List JSON Object
		$retValue = '{"results":' . json_encode($contacts) . ',"error":""}';
		sendResultInfoAsJson($retValue);
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

    function returnWithError($err)
	{
		// Constructs and Sends Error JSON Object
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}


?>

