<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$inputData = getRequestInfo();

if (!isset($inputData["id"])) {
    returnWithError("Missing id");
    exit();
}

$id = $inputData["id"];

$connection = new mysqli("localhost", "GOAT", "ILoveLamp", "COP4331");

if ($connection->connect_error) {
    returnWithError($connection->connect_error);
    exit();
}
// make an sql statement that deletes contacts with the given firstname, lastname, phone, email, given userid
$sqlStatement = $connection->prepare("DELETE FROM Contacts WHERE FirstName = ? AND LastName = ? AND Phone = ? AND Email = ? AND UserID = ?");
$sqlStatement->bind_param("ssssii", $inputData["firstName"], $inputData["lastName"], $inputData["phone"], $inputData["email"], $inputData["userId"]);

if (!$sqlStatement->execute()) {
    returnWithError("SQL Error: " . $sqlStatement->error);
    exit();
}

if ($sqlStatement->affected_rows > 0) {
    returnWithInfo($id);
} else {
    returnWithError("No contact found with that ID");
}

$sqlStatement->close();
$connection->close();

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithInfo($id) {
    $retValue = '{"id":' . $id . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

?>