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

// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');


// This function is called whenever the user click a card
function cardClicked(elCard) {

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
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                //play wrong sound
                audioWrong.play();
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
