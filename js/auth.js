const baseUrl = "https://poosproject.xyz/api";
const extension = "php";

let userId = 0;
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

                if(userId == 0) {
                    document.getElementById("loginResult").innerHTML = "No login information entered";
					return;
                }
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

                // Save login state
				// saveCookie();
                
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

function logout() {
    // TODO: Implement function
}

function saveCookie() {
    // TODO: Implement function
}

function readCookie() {
    // TODO: Implement function
}