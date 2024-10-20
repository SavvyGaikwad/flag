// Import the saveScoreToDynamoDB function
const { saveScoreToDynamoDB } = require('./awsConfig'); // Ensure the path is correct based on your project structure

// Global variables
let userId = ''; // Variable to hold the username
let correct;
let amtCorrect = 0;
let seconds = 90;
let amtIncorrect = 0;

// Function to start the game
function startGame() {
    userId = document.getElementById("username").value; // Get the username from the input field
    if (!userId) {
        alert("Please enter a username!"); // Alert if the username is not entered
        return;
    }

    document.getElementById("usernameSection").style.display = "none"; // Hide the username input section
    document.getElementById("card").style.display = "block"; // Show the game section
    main(); // Start the game
    timer(); // Start the timer
}

function main() {
    let options = [];
    const maxOptions = 4;

    while (options.length < maxOptions) {
        let country = getRandomCountry();
        if (options.indexOf(country) === -1) {
            options.push(country);
        }
    }
    correct = options[Math.round(Math.random() * (options.length - 1))];
    for (let i = 0; i < options.length; i++) {
        document.getElementById(`option${i + 1}label`).innerHTML = options[i].name;
        document.getElementById(`option${i + 1}input`).value = options[i].name;
        document.getElementById(`option${i + 1}input`).checked = false;
    }

    document.getElementById("flag").src = correct.flag;
}

function finish() {
    clearInterval(checkInterval);
    document.getElementById("alert").style.display = "block";
    document.getElementById("card").style.display = "none";
    document.getElementById("alertscore").innerHTML = amtCorrect;

    let percentage = Math.round((amtCorrect / (amtCorrect + amtIncorrect)) * 100);
    if (isNaN(percentage)) percentage = 100;
    document.getElementById("alertaccuracy").innerHTML = `${percentage}%`;

    // Save the score to DynamoDB
    const gameName = 'Flag Quiz'; // Use the new game name
    const score = amtCorrect; // Use the actual score (amtCorrect)

    // Call the function to save the score
    saveScoreToDynamoDB(userId, gameName, score);
}

// Timer function to finish the game after 90 seconds
function timer() {
    setTimeout(finish, seconds * 1000);
    document.getElementById("time").innerHTML = seconds;
    let countdown = setInterval(function () {
        seconds--;
        document.getElementById("time").textContent = seconds;
        if (seconds <= 0) clearInterval(countdown);
        if (seconds === 5) document.getElementById("time").style.color = "#ff0000";
    }, 1000);
}

function refresh() {
    location.reload(); // Reload the page to restart the game
}

let checkInterval = setInterval(check, 50);
main(); // Start the game immediately when the script runs
