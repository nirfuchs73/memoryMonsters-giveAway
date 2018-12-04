//Get userName
var userName = localStorage.getItem('userName');
if (userName === null) {
    userName = prompt("Please enter your name", "Anonymous");
    if (userName !== null) {
        localStorage.setItem('userName', userName);
    }
}
//Update page
document.getElementById("userName").innerHTML = "User Name: " + userName;

//Get bestTime
var bestTime = localStorage.getItem('bestTime');
//Update page
if (bestTime !== null) {
    document.getElementById("bestTime").innerHTML = "Best Time: " + secondsToTime(bestTime);
}

//Hide Play Again button
document.getElementById('playAgain').style.display = 'none';

//Shuffle Cards
shuffleCards();

// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var isProcessing = false;
var firstClick = true;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 8;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');


// This function is called whenever the user click a card
function cardClicked(elCard) {
    //If first click
    if (firstClick === true) {
        firstClick = false;
        startTime();
    }

    if (isProcessing === true) {
        return;
    }

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2) {
            isProcessing = true;
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                //play wrong sound
                audioWrong.play();
                isProcessing = false;
            }, 1000)

        } else {
            // Yes! a match!
            flippedCouplesCount++;
            elPreviousCard = null;
            //audioRight.play();

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                //play win sound
                audioWin.play();
                //Display Play Again button
                document.getElementById('playAgain').style.display = 'inline-block';
                stopTime();
                bestTime = localStorage.getItem('bestTime');
                if (bestTime === null || secondsTotal < bestTime) {
                    localStorage.setItem('bestTime', secondsTotal);
                    document.getElementById("bestTime").innerHTML = "Best Time: " + secondsToTime(secondsTotal);
                }
            } else {
                //play right sound
                audioRight.play();
            }
        }
    }
}

function changeUser() {
    userName = prompt("Please enter your name", "Anonymous");
    if (userName !== null) {
        localStorage.setItem('userName', userName);
        document.getElementById("userName").innerHTML = "User Name: " + userName;
    }
}

function playAgain() {
    //reset variables
    elPreviousCard = null;
    flippedCouplesCount = 0;
    isProcessing = false;
    firstClick = true;
    //flip all the cards
    var cards = document.getElementsByClassName("card");
    for (var i = 0; i < cards.length; ++i) {
        cards[i].classList.remove('flipped');
    }
    //Shuffle Cards
    shuffleCards();
    //Hide Play Again button
    document.getElementById('playAgain').style.display = 'none';
    resetTime();
}

function shuffleCards() {
    var board = document.querySelector('.board');
    for (var i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);
    }
}

var seconds = 0;
var minutes = 0;
var hours = 0;
var t;
var secondsTotal = 0;

function startTime() {
    incrementTime();
}

function stopTime() {
    clearTimeout(t);
}

function resetTime() {
    document.getElementById("output").innerHTML = "Time: 00:00:00";
    seconds = 0;
    minutes = 0;
    hours = 0;
    secondsTotal = 0;
}

function incrementTime() {
    var seconds1 = 0;
    var minutes1 = 0;
    var hours1 = 0;
    t = setTimeout(function () {
        seconds++;
        secondsTotal++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        hours1 = hours;
        minutes1 = minutes;
        seconds1 = seconds;
        if (hours1 < 10) {
            hours1 = "0" + hours1;
        }
        if (minutes1 < 10) {
            minutes1 = "0" + minutes1;
        }
        if (seconds1 < 10) {
            seconds1 = "0" + seconds1;
        }
        document.getElementById("output").innerHTML = "Time: " + hours1 + ":" + minutes1 + ":" + seconds1;
        incrementTime();
    }, 1000)
}

function secondsToTime(seconds) {
    var hrs = Math.floor(seconds / 60 / 60);
    seconds = seconds - (hrs * 60 * 60);
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    if (hrs < 10) {
        hrs = "0" + hrs;
    }
    if (mins < 10) {
        mins = "0" + mins;
    }
    if (secs < 10) {
        secs = "0" + secs;
    }
    return hrs + ":" + mins + ":" + secs;
}

