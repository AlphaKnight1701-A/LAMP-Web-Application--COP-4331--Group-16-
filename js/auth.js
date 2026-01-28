const baseUrl = "http://poosproject.xyz/api";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function login() {
    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    // The span tag that gives messages to the user
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {
        login: username,
        password: password
    }

    let jsonPayload = JSON.stringify(tmp);
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