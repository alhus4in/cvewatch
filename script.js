// script.js - external script for CVEWatch
// Shows today's date on the page

var today = new Date(); // current date and time

document.write("<p class='muted'>Today: " + today.toDateString() + "</p>");