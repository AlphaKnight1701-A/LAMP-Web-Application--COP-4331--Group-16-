// parse the contact list to send out lists of user contact information
function parseContact(contactList) 
{
	let contactId = [];
	let firstName = [];
	let lastName = [];
	let phone = [];
	let email = [];
	
	for( let i=0; i<contactList.length; i++ ) 
	{
		contactId.push(contactList[i].id);
		firstName.push(contactList[i].firstName);
		lastName.push(contactList[i].lastName);
		phone.push(contactList[i].phone);
		email.push(contactList[i].email);
	}

	return {contactId, firstName, lastName, phone, email};
}

// build table to list contacts on the homepage
function buildTable(contactId, firstName, lastName, phone, email) 
{
	// table header
	let table = "<table><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Delete</th></tr>";
	let deleteButton = "<button class='deleteButton' onclick='deleteContact(this)'>Delete</button>";
	// building each row of the table with contact information
	for(let i = 0; i < firstName.length; i++) 
	{
		table += "<tr data-contact-id='" + contactId[i] + "'><td>" +
		firstName[i] + "</td><td>" +
		lastName[i] + "</td><td>" +
		phone[i] + "</td><td>" +
		email[i] + "</td><td>" +
		deleteButton + "</td></tr>";
	}

	// ending the table
	table += "</table>";
	return table;
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

    console.log(jsonPayload);

	let url = baseUrl + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				// building the table with the information retrieved
				let contactInfo = parseContact(jsonObject.results);
				document.getElementsByTagName("p")[0].innerHTML = 
				buildTable(
					contactInfo.contactId,
					contactInfo.firstName, 
					contactInfo.lastName, 
					contactInfo.phone, 
					contactInfo.email
				);

				if (src == 0)
				{
					document.getElementById("contactList").innerHTML = buildTable;
					document.getElementById("searchResults").innerHTML = "";
				}
				else
				{
					document.getElementById("searchResults").innerHTML = buildTable;
				}
			}
		};
		console.log(contactList)
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function enableDelete()
{
	document.getElementById("deleteContactButton").classList.remove("hidden");
}

function deleteContact(button)
{
	let row = button.parentNode.parentNode;
	let contactId = row.getAttribute("data-contact-id"); // contact id stored as data attribute on the row

	let firstName = row.cells[0].innerHTML;
	let lastName = row.cells[1].innerHTML;
	let phone = row.cells[2].innerHTML;
	let email = row.cells[3].innerHTML;

	console.log(firstName, lastName, phone, email);

	let tmp = {
		id: contactId,
		userId: userId,
	};
	
	let jsonPayload = JSON.stringify(tmp);
	// send information over for removal from database
	let url = baseUrl + "/DeleteContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				row.remove(); // Remove the row from the table
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("deleteContactResult").innerHTML = err.message;
	}

}

function addContact()
{
	let firstName = document.getElementById("addFirstName").value.trim();
	let lastName = document.getElementById("addLastName").value.trim();
	let phone = document.getElementById("addPhone").value.trim();
	let email = document.getElementById("addEmail").value.trim();

	if (firstName === "" || lastName === "") {
		document.getElementById("addContactResult").innerHTML = "First and last name required";
		return;
	}

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		email: email,
		userId: userId
	};

	let jsonPayload = JSON.stringify(tmp);
	let url = baseUrl + "/AddContacts." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				document.getElementById("addContactResult").innerHTML = "Contact added";

				// clear form
				document.getElementById("addFirstName").value = "";
				document.getElementById("addLastName").value = "";
				document.getElementById("addPhone").value = "";
				document.getElementById("addEmail").value = "";

				// refresh contact list
				searchContact();
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}