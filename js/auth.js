const baseUrl = "https://poosproject.xyz/api";
const extension = "php";

let userId = -1;
let firstName = "";
let lastName = "";

function login() {

    userId = 0;
	firstName = "";
	lastName = ""; 

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    // The span tag that gives messages to the user
    document.getElementById("loginResult").innerHTML = "";

    // Check empty fields and disallow login
    if (username === "" || password === "") {
        document.getElementById("loginResult").innerHTML = "Please enter both Username and Password";
        return;
    }

    let tmp = {
        login: username,
        password: password
    }

    let jsonPayload = JSON.stringify(tmp);

    let url = baseUrl + "/Login." + extension;

    let request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		request.onreadystatechange = function() {
            // Response available with HTTP status code 200
            if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(request.responseText);
				userId = jsonObject.id;
		
				if(userId < 1) {		
					document.getElementById("loginResult").innerHTML = "Username/Password combination is incorrect";
					return;
                }
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

                // Save login state
				saveCookie();
                
                // Direct to homepage on successful login
				window.location.href = "homepage.html";
			}
		};
		request.send(jsonPayload);
	}
    catch(err) {
        document.getElementById("loginResult").innerHTML = err.message;
	}
}

function signup()
{
    let first = document.getElementById("signupFirstName").value.trim();
    let last = document.getElementById("signupLastName").value.trim();
    let username = document.getElementById("signupUsername").value.trim();
    let password = document.getElementById("signupPassword").value;
    let confirm = document.getElementById("signupConfirmPassword").value;
    document.getElementById("signupResult").innerHTML = "";
    if (first === "" || last === "" || username === "" || password === "" || confirm === "") {
        document.getElementById("signupResult").innerHTML = "Please fill out all fields";
        return;
    }
    if (password !== confirm) {
        document.getElementById("signupResult").innerHTML = "Passwords do not match";
        return;
    }
    let tmp =
    {
        firstName: first,
        lastName: last,
        login: username,
        password: password
    };
    let jsonPayload = JSON.stringify(tmp);
    let url = baseUrl + "/SignUp." + extension;
    let request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        request.onreadystatechange = function() {
			if(this.readyState != 4) return;

            if (this.status == 200) {
                let jsonObject = JSON.parse(request.responseText);
                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("signupResult").innerHTML = jsonObject.error;
                    return;
                }
                document.getElementById("signupResult").innerHTML = "Account created";
                window.location.href = "login.html";
            }
        };
        request.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}
// parse the contact list to send out lists of user contact information
function parseContact(contactList) 
{
	
	let firstName = [];
	let lastName = [];
	let phone = [];
	let email = [];
	
	for( let i=0; i<contactList.length; i++ ) 
	{
		firstName.push(contactList[i].firstName);
		lastName.push(contactList[i].lastName);
		phone.push(contactList[i].phone);
		email.push(contactList[i].email);
	}

	return {firstName, lastName, phone, email};
}
// build table to list contacts on the homepage
function buildTable(firstName, lastName, phone, email) 
{
	// table header
	let table = "<table><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Delete</th></tr>";
	let deleteButton = "<button class='deleteButton' onclick='deleteContact(this)'>Delete</button>";
	// building each row of the table with contact information
	for(let i = 0; i < firstName.length; i++) 
	{
		table += "<tr><td>" +
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

	let firstName = row.cells[0].innerHTML;
	let lastName = row.cells[1].innerHTML;
	let phone = row.cells[2].innerHTML;
	let email = row.cells[3].innerHTML;

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		email: email,
		userId: userId
	};
	
	let jsonPayload = JSON.stringify(tmp);
	// send information over for removal from database
	let url = baseUrl + "/DeleteContact." + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				document.getElementById("deleteContactResult").innerHTML = "Contact deleted";
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


function logout() {
	// Expiry date is UNIX epoch
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	// Go to index
	window.location.href = "/";
}

function saveCookie() {
	let minutes = 20;
	let dt = new Date();
	dt.setTime(dt.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + dt.toGMTString() + ";path=/";
}

function readCookie() {
    userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
        console.log(tokens)
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
}

// Helper function for components like app-header
function isLoggedIn() {
	readCookie(); // fills global userId, firstName, and lastName
	return userId >= 0;
}

function checkLogin() {
	if(!isLoggedIn())
	{
		// Trying to access homepage while logged out
		if(window.location.pathname.endsWith("homepage.html")) {
			// Redirect back to login page with login error
			window.location.href = "login.html?error=not_logged_in";
			console.log("Not logged in");
		}
	}
	else
	{
		// Logged in on index page
		if(window.location.pathname === "/" || window.location.pathname.endsWith("index.html")) {
			// Change login button to logout
			document.getElementById("homeLoginButton").innerHTML = "Logout";
			document.getElementById("homeLoginButtonLink").href = "javascript:void(0)"; // Don't link to any page
			document.getElementById("homeLoginButton").onclick = () => {
				logout();
			};

			// Change signup button to homepage
			document.getElementById("signupButton").innerHTML = "Go to Homepage";
			document.getElementById("signupButtonLink").href = "homepage.html";

			// Show username
			document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
		}

		// Logged in on homepage
		if(window.location.pathname.endsWith("homepage.html")) {
			// Show first name
			document.getElementById("firstName").innerHTML = `Hello, ${firstName}!`;
		} 

	}
}
