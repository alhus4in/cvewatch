// script.js - external script for CVEWatch (all pages)

// HOME PAGE 

var tipImages = ["tip1.svg", "tip2.svg", "tip3.svg", "tip4.svg"];
var tipTexts = [
    "Use a long, unique password for every account.",
    "Install updates as soon as they are available.",
    "Patch Critical CVEs before anything else.",
    "Never click links in emails you did not expect."
];
var currentTip = 0;
var tableIds = ["latestTable", "pastTable"];
var currentLevel = "All"; // severity chosen with the filter buttons

// runs when the Home page has loaded (body onload)
function start() {
    showDate();
    countStats();
    showTip();
}

function showDate() {
    var today = new Date();
    document.getElementById("today").innerHTML = today.toDateString();
}

// Dynamic picture and text
function showTip() {
    document.getElementById("tipImg").src = tipImages[currentTip];
    document.getElementById("tipText").innerHTML = tipTexts[currentTip];
}

function nextTip() {
    currentTip = currentTip + 1;
    if (currentTip == tipImages.length) {
        currentTip = 0;
    }
    showTip();
}

// Count the CVEs in both tables and show the numbers in the stat boxes
function countStats() {
    var total = 0;
    var critical = 0;
    var high = 0;
    var medium = 0;

    for (var t = 0; t < tableIds.length; t++) {
        var rows = document.getElementById(tableIds[t]).rows;
        for (var i = 1; i < rows.length; i++) {
            var level = rows[i].cells[2].innerText;
            total++;
            if (level == "Critical") {
                critical++;
            } else if (level == "High") {
                high++;
            } else if (level == "Medium") {
                medium++;
            }
        }
    }

    document.getElementById("statTotal").innerHTML = total;
    document.getElementById("statCritical").innerHTML = critical;
    document.getElementById("statHigh").innerHTML = high;
    document.getElementById("statMedium").innerHTML = medium;
}

// Dynamic elements: hide or show table rows using the search box and severity list
function applyFilters() {
    var text = document.getElementById("searchBox").value.toLowerCase();
    var shown = 0;

    for (var t = 0; t < tableIds.length; t++) {
        var rows = document.getElementById(tableIds[t]).rows;
        for (var i = 1; i < rows.length; i++) {
            var rowText = rows[i].innerText.toLowerCase();
            var rowLevel = rows[i].cells[2].innerText;
            var show = true;

            if (currentLevel != "All") {
                if (currentLevel != rowLevel) {
                    show = false;
                }
            }
            if (rowText.indexOf(text) == -1) {
                show = false;
            }

            if (show == true) {
                rows[i].style.display = "";
                shown++;
            } else {
                rows[i].style.display = "none";
            }
        }
    }

    var msg = document.getElementById("filterMsg");
    if (shown == 0) {
        msg.innerHTML = "No CVEs match your search.";
        msg.style.color = "#f87171";
    } else {
        msg.innerHTML = "Showing " + shown + (shown == 1 ? " CVE" : " CVEs") + " (" + currentLevel + ")";
        msg.style.color = "#94a3b8";
    }
}

// Severity buttons: remember the chosen level, then filter
function setLevel(level) {
    currentLevel = level;
    applyFilters();
}

function resetFilters() {
    document.getElementById("searchBox").value = "";
    currentLevel = "All";
    applyFilters();
}

// Show or hide a section of the page
function toggleSection(sectionId, buttonId) {
    var box = document.getElementById(sectionId);
    var btn = document.getElementById(buttonId);

    if (box.style.display == "none") {
        box.style.display = "block";
        btn.innerHTML = "Hide";
    } else {
        box.style.display = "none";
        btn.innerHTML = "Show";
    }
}

// FORMS (Login and Sign up) 

// Shows an error (red border) or success (green border) for one field
function setError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(errorId);

    if (message == "") {
        err.innerHTML = "";
        input.style.border = "2px solid #22c55e";
        return true;
    }
    err.innerHTML = message;
    input.style.border = "2px solid #ef4444";
    return false;
}

// true if the text has at least one character between first and last
function hasChar(text, first, last) {
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (c >= first) {
            if (c <= last) {
                return true;
            }
        }
    }
    return false;
}

function isValidEmail(email) {
    var at = email.indexOf("@");
    var dot = email.lastIndexOf(".");

    if (at < 1) {
        return false;
    }
    if (dot < at + 2) {
        return false;
    }
    if (dot == email.length - 1) {
        return false;
    }
    return true;
}

function checkName() {
    var name = document.getElementById("fullname").value;

    if (name.length < 3) {
        return setError("fullname", "nameError", "Name must be at least 3 characters.");
    }
    if (hasChar(name, "0", "9")) {
        return setError("fullname", "nameError", "Name cannot contain numbers.");
    }
    return setError("fullname", "nameError", "");
}

function checkEmail() {
    var email = document.getElementById("email").value;

    if (email == "") {
        return setError("email", "emailError", "Email is required.");
    }
    if (isValidEmail(email) == false) {
        return setError("email", "emailError", "Enter a valid email like name@example.com.");
    }
    return setError("email", "emailError", "");
}

// 0 to 4: length 8, digit, capital letter, length 12
function passwordScore(password) {
    var score = 0;
    if (password.length >= 8) {
        score++;
    }
    if (hasChar(password, "0", "9")) {
        score++;
    }
    if (hasChar(password, "A", "Z")) {
        score++;
    }
    if (password.length >= 12) {
        score++;
    }
    return score;
}

// Strength text under the password box (shown when you leave the field)
function showStrength() {
    var password = document.getElementById("password").value;
    var label = document.getElementById("strength");

    switch (passwordScore(password)) {
        case 0:
        case 1:
            label.innerHTML = "Strength: Weak";
            label.style.color = "#ef4444";
            break;
        case 2:
        case 3:
            label.innerHTML = "Strength: Medium";
            label.style.color = "#eab308";
            break;
        default:
            label.innerHTML = "Strength: Strong";
            label.style.color = "#22c55e";
    }
    if (password == "") {
        label.innerHTML = "";
    }
}

function checkPassword() {
    var password = document.getElementById("password").value;

    if (password.length < 8) {
        return setError("password", "passwordError", "Password must be at least 8 characters.");
    }
    if (hasChar(password, "0", "9") == false) {
        return setError("password", "passwordError", "Password must contain a number.");
    }
    if (hasChar(password, "A", "Z") == false) {
        return setError("password", "passwordError", "Password must contain a capital letter.");
    }
    return setError("password", "passwordError", "");
}

function checkLoginPassword() {
    var password = document.getElementById("password").value;

    if (password == "") {
        return setError("password", "passwordError", "Password is required.");
    }
    return setError("password", "passwordError", "");
}

function checkConfirm() {
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirm").value;

    if (confirm == "") {
        return setError("confirm", "confirmError", "Please confirm your password.");
    }
    if (confirm != password) {
        return setError("confirm", "confirmError", "Passwords do not match.");
    }
    return setError("confirm", "confirmError", "");
}

// Show or hide the typed password
function togglePassword(inputId, buttonId) {
    var input = document.getElementById(inputId);
    var btn = document.getElementById(buttonId);

    if (input.type == "password") {
        input.type = "text";
        btn.innerHTML = "Hide password";
    } else {
        input.type = "password";
        btn.innerHTML = "Show password";
    }
}

// onsubmit: returns false so the form is never sent (this site has no server)
function validateSignup() {
    var nameOk = checkName();
    var emailOk = checkEmail();
    var passwordOk = checkPassword();
    var confirmOk = checkConfirm();

    if (nameOk == true) {
        if (emailOk == true) {
            if (passwordOk == true) {
                if (confirmOk == true) {
                    window.alert("Account created successfully! You can now log in.");
                }
            }
        }
    }
    return false;
}

function validateLogin() {
    var emailOk = checkEmail();
    var passwordOk = checkLoginPassword();

    if (emailOk == true) {
        if (passwordOk == true) {
            window.alert("Login successful! Welcome to CVEWatch.");
        }
    }
    return false;
}

// onreset: remove all messages and borders
function clearErrors() {
    var ids = ["fullname", "email", "password", "confirm"];
    var errors = ["nameError", "emailError", "passwordError", "confirmError"];

    for (var i = 0; i < ids.length; i++) {
        var input = document.getElementById(ids[i]);
        if (input != null) {
            input.style.border = "1px solid #3b4d70";
            document.getElementById(errors[i]).innerHTML = "";
        }
    }
    var strength = document.getElementById("strength");
    if (strength != null) {
        strength.innerHTML = "";
    }
}