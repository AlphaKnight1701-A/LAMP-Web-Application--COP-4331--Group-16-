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

$sqlStatement = $connection->prepare("DELETE FROM Contacts WHERE ID = ?");
$sqlStatement->bind_param("i", $id);

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