/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 3a - Extension of Dicee Code
GOAL: Integrate 3rd dice, add to user experience
FILENAME: index.js
DATE: 1/30/2026
*/
/* Changed: 
    1) added logic for 3rd dice (by working with any number of dice)
    2) added animateDiceRoll()(600ms) function and wrapped outcome logic in setTimeout(,600)
    3) generated a tutorial overlay to display on refresh, per requirements

AI usage: used in developing algorithms, "modal" popup logic for tutorial
Code: by me, unless otherwise stated
Comments: by me
*/
/* Algorithm: 
1. Roll three dice
2. Animate the roll for 600ms
3. Find winner(s) and display result

-event handler for reroll button -> call playGame()
-event handlers for input fields -> change player titles
-event handlers for tutorial overlay -> hide or show
-
*/

//##### Functions #####

/* Adds '.rolling' CSS class to imgs, Cycle through dice faces for 600ms
Params: 0. imgElement > NodeList from DOM Query - img to update
        1. finalNumber > int - prerolled outcome
Returns: void
Effects: affect <img> elements 
*/
function animateDiceRoll(imgElement, finalNumber) {
    imgElement.classList.add("rolling");

    // make local variable
    let currentFace = rollDice();

    // cycle through dice faces
    const interval = setInterval (() => {
        imgElement.setAttribute("src", findDiceImg(currentFace));
        currentFace = rollDice();
    }, 100);

    // stop after 0.6 seconds
    setTimeout(() => {
        clearInterval(interval);
        imgElement.setAttribute("src", findDiceImg(finalNumber))
        imgElement.classList.remove("rolling");
    }, 600);
}

// roll a random number between 1 and 6 
// params: none
// returns: number 1 to 6
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// helper function to concatonate "images/dice" + ".png"
// params: number
// returns: "images/dice" + number + ".png"
function findDiceImg(num) {
    return "images/dice" + num + ".png";
}

/* recallable function to handle the reroll logic
Params: none, attached to eventlistener
Effects: Updates DOM with new dice values and winner announcement
*/
function playGame() {

    // initalize variables
    // roll outcomes
    var randomNum1 = rollDice();
    var randomNum2 = rollDice();
    var randomNum3 = rollDice();

    // Get current player names from input fields
    const player1Name = document.querySelector("#player1name").value;
    const player2Name = document.querySelector("#player2name").value;
    const player3Name = document.querySelector("#player3name").value;

    //make map for finding max, knowing position, updating headers
    //array of objects {player, value}
    const diceMap = [
        { player: player1Name, value: randomNum1 },
        { player: player2Name, value: randomNum2 },
        { player: player3Name, value: randomNum3 }
    ];

    //find max value
    //make array of values from dice map
    const scores = diceMap.map(dice => dice.value);
     //find max number, ... spread operator so Math.max works 
    const maxScore = Math.max(...scores);

    //use filter to keep all max values
    //array of objects {player, value}
    const winners = diceMap.filter(dice => dice.value === maxScore);

    //animate dice rolls
    animateDiceRoll(document.querySelectorAll("img")[0], randomNum1);
    animateDiceRoll(document.querySelectorAll("img")[1], randomNum2);
    animateDiceRoll(document.querySelectorAll("img")[2], randomNum3);

    //wait until animation is done (600ms)
    //then set h1 title to display winners
    setTimeout(() => {
        if (winners.length > 1) {
             const names = winners.map(w => w.player).join(" and ");
             document.querySelector("h1").textContent = `Draw between: ${names}`;
        }
        else {
            document.querySelector("h1").textContent = `${winners[0].player} Wins!`;
        }
    }, 600);
}


// ##### Main Code ##### 


// Call logic on page load
// User can get a feel for how it works before starting
playGame();

// Click event listener for reroll button
// ON: click/tap event
// DOES: call playGame() to redo dice rolling logic
document.querySelector(".reroll-btn").addEventListener("click", playGame);

// Input event listeners for <input> elements
// ON: "input" event, so updates are live for UX
// DOES: change relevant dice div <p> textContent to match input value
document.querySelector("#player1name").addEventListener("input", function() {
    document.querySelectorAll(".dice p")[0].textContent = this.value;
});
document.querySelector("#player2name").addEventListener("input", function() {
    document.querySelectorAll(".dice p")[1].textContent = this.value;
});
document.querySelector("#player3name").addEventListener("input", function() {
    document.querySelectorAll(".dice p")[2].textContent = this.value;
});
/* saw a function like this in the drum game, so including it */


// ### Overlay ###

// Tutorial modal functions
// Get the modal and close button
const tutorialModal = document.getElementById("tutorialModal");
const closeBtn = document.querySelector(".close");

/* Shows the tutorial modal
ON: refresh, tutorial button event
DOES: Makes modal visible
*/
function showTutorial() {
    tutorialModal.style.display = "block";
}

/* Hides the tutorial modal
ON: none
DOES: Hides modal
*/
function hideTutorial() {
    tutorialModal.style.display = "none";
}

// Show tutorial on page load
window.addEventListener("load", showTutorial);

// Close tutorial when clicking the X button
closeBtn.addEventListener("click", hideTutorial);

// Close tutorial when clicking outside the modal content
window.addEventListener("click", function(event) {
    if (event.target === tutorialModal) {
        hideTutorial();
    }
});

// Show tutorial when clicking the Tutorial button in footer
document.querySelector(".tutorial-btn").addEventListener("click", showTutorial);
// ### End Overlay ###


// ##### End Main #####


