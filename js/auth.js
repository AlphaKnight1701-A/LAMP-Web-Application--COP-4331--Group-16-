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
function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

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
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
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

function logout() {
    // TODO: Implement function
}

function saveCookie() {
	let minutes = 20;
	let dt = new Date();
	dt.setTime(dt.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ";lastName=" + lastName + ";userId=" + userId + ";expires=" + dt.toGMTString() + ";path=/";
	console.log("saveCookie() has been run");
	console.log(`Cookie: ${document.cookie}`);
}

function readCookie() {
    userId = -1;
	let data = document.cookie;
	let splits = data.split(";");
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
	
	if( userId < 0 )
	{
		// Redirect back to login page with login error
		// window.location.href = "login.html?error=not_logged_in";
		console.log("Not logged in");
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}
