//Get userName
var userName = localStorage.getItem('userName');
if (userName === null) {
    userName = prompt("Please enter your name", "Anonymous");
    if (userName !== null) {
        localStorage.setItem('userName', userName);
    }
}
//Update page
document.querySelector('.userName').innerHTML = "User Name: " + userName;

//Get bestTime
var bestTime = localStorage.getItem('bestTime');
//Update page
if (bestTime !== null) {
    var hours = Math.floor(bestTime / 1000 / 60 / 60);
    var mins = Math.floor(bestTime / 1000 / 60);
    var secs = Math.floor((bestTime / 1000) % 60);
    var tenths = Math.floor((bestTime / 100) % 10);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (mins < 10) {
        mins = "0" + mins;
    }
    if (secs < 10) {
        secs = "0" + secs;
    }
    document.querySelector('.bestTime').innerHTML = "Best Time: " + hours + ":" + mins + ":" + secs + ":" + tenths + "0";
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
var msStartTime = 0;
var msEndTime = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');


// This function is called whenever the user click a card
function cardClicked(elCard) {
    //If first click
    if (firstClick === true) {
        msStartTime = Date.now();
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
                msEndTime = Date.now();
                var ms = msEndTime - msStartTime;
                bestTime = localStorage.getItem('bestTime');
                if (bestTime === null || ms < bestTime) {
                    localStorage.setItem('bestTime', ms);
                    var hours = Math.floor(ms / 1000 / 60 / 60);
                    var mins = Math.floor(ms / 1000 / 60);
                    var secs = Math.floor((ms / 1000) % 60);
                    var tenths = Math.floor((ms / 100) % 10);
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    if (mins < 10) {
                        mins = "0" + mins;
                    }
                    if (secs < 10) {
                        secs = "0" + secs;
                    }
                    document.querySelector('.bestTime').innerHTML = "Best Time: " + hours + ":" + mins + ":" + secs + ":" + tenths + "0";
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
        document.querySelector('.userName').innerHTML = "User Name: " + userName;
    }
}

function playAgain() {
    //reset variables
    elPreviousCard = null;
    flippedCouplesCount = 0;
    isProcessing = false;
    firstClick = true;
    msStartTime = 0;
    msEndTime = 0;
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

var time = 0;
var running = false;

function startTime() {
    if (running === false) {
        running = true;
        incrementTime();
        //} else {
        //    running = 0;
        //}
    }
}


function stopTime() {
    running = false;
}

function resetTime() {
    running = false;
    time = 0;
    document.getElementById("output").innerHTML = "Time: 00:00:00:00";
}

function incrementTime() {
    if (running === true) {
        setTimeout(function () {
            time++;
            var hours = Math.floor(time / 10 / 60 / 60);
            var mins = Math.floor(time / 10 / 60);
            var secs = Math.floor(time / 10 % 60);
            var tenths = time % 10;
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (mins < 10) {
                mins = "0" + mins;
            }
            if (secs < 10) {
                secs = "0" + secs;
            }
            document.getElementById("output").innerHTML = "Time: " + hours + ":" + mins + ":" + secs + ":" + tenths + "0";
            incrementTime();
        }, 100)
    }
}

