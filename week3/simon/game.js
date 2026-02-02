/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 3b - Extension of Simon Code
GOAL: add new "level", use JQuery for DOM manipulation
FILENAME: game.js
DATE: 2/1/2026
*/
/* Changes: 
  1) added event listener for hardmode checkbox (switch)
  2) updated nextSequence() to:
    -- account for hardMode flag
    -- have inner scope functions: 
  3) speedingUp()
    -- handles add/remove of animation class
  4) playbackSequence()
    -- added 15% speedup every x=SPEEDUP(5) levels, capped at x=MAXDEPLAY(250ms)
      // any faster and I can't keep track 
    -- loops through gamePattern[] and flashes sequence
  5) toggleMode()
    -- handles DOM change for button display

AI Usage: used in developing some functions
Code: by me, or grandfathered from assignment, unless otherwise stated
Comments: by me
  -- gotta learn somehow
*/

// store options for normal/hard mode layouts
//const as they don't change
const buttonNamesNormal = ["q","w","e","r","t","y"];
const buttonNamesHard = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"]
                  
// array for game generated pattern / user pattern
var gamePattern = [];
var userInputPattern = [];

// track if game is going and progress
var started = false;
var level = 0;

// track difficulty mode for layout / event handlers
var hardMode = false;

// const parameters for testing playbackSequence() 
const SPEEDUP = 5 ; //?? 5
const SPEEDAMNT = 0.85 ;//?? 0.85
const MAXDELAY = 250 ;//?? 250
const DEFAULTSPD = 500;//?? 500

// event handler for keypress (start of game)
$(document).keypress(function() {
  if (!started) {
    setLevelText();
    nextSequence();
    started = true;
  }
});

// event handler for button click
$(".btn").click(function() {

  var userChosenButton = $(this).attr("id");
  userInputPattern.push(userChosenButton);

  // playSound(userChosenColour);
  animatePress(userChosenButton);

  checkAnswer(userInputPattern.length-1);
});

// #event handler for hard mode checkbox
$('input[type=checkbox][name=hardmode]').change(function() {
    // If checked, hardMode is true (Hard Mode is active)
    hardMode = this.checked;
    startOver();
    toggleMode();
    nextSequence();
});

/* Function: validate whether button pressed by user is correct
Param: currentLevel = last index [-1] of userInputPattern, x of y in current sequence
Returns: void */
function checkAnswer(currentLevel) {

  // check for each press if correct
  if (gamePattern[currentLevel] === userInputPattern[currentLevel]) {

    //if correct for all values
    if (userInputPattern.length === gamePattern.length){

      //make a new sequence after 1s
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }

  //if failed at any point
  //flash screen red, then off after 200ms
  } else {
    // playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    startOver();
  }
}

/* Function: logic for next level/stage
Param, returns: void;
DOES: choose next button, sequence playback, */
function nextSequence() {

  // 1. clear user array, increment level
  userInputPattern = [];
  level++; 

  // 2. set level text to reflect level up
  setLevelText();

  // 3. choose next button
  let randomChosenLetter = 'q';
  let randomNumber = '0';

  if (!hardMode){
    randomNumber = Math.floor(Math.random() * 6); //buttonNamesNormal.length
    randomChosenLetter = buttonNamesNormal[randomNumber];

  } else {/*(hardMode)*/
    randomNumber = Math.floor(Math.random() * 26); //buttonNamesHard.length
    randomChosenLetter = buttonNamesHard[randomNumber];
  }

  // 4. push choice to gamePattern[]
  gamePattern.push(randomChosenLetter);

  // 5. every 10 levels update #level-title w/ animation
  if (level % SPEEDUP === 0){
    speedingUp();
  }

  // 6. playback animation of gamePattern[]
  setTimeout(function() {
    playbackSequence();
  }, 500);
  
  // -------------------
  //### inner functions ### //

  /* Function: apply css animation to title
  Param, Return: void;
  DOES: jQuery updates on #level-title + speeding-up add/rmv class */
  function speedingUp() {

    //1. add css class + change title
    $("#level-title").addClass("speeding-up");
    $("#level-title").text("Speeding Up!!!");

    // 2. run animation for 1 second + change title back
    setTimeout(function () {
      $("#level-title").removeClass("speeding-up");
      setLevelText();
    }, 1000);
  }

  /* Function: flash gamePatten[] to player
  Param, Return: void;
  Does: speed up delay every 10 levels, jQuery fadein/out */
  function playbackSequence() {

    // Calculate delay: DEFAULTS: 500ms base, -15% every 5 levels, min 250ms
    let delay = DEFAULTSPD * Math.pow(SPEEDAMNT, Math.floor(level / SPEEDUP)); //0.85, 10
    delay = Math.max(delay, MAXDELAY); // ?: 250ms

    for (let i = 0; i < gamePattern.length; i++) {
      setTimeout(function() {
        // animatePress(gamePattern[i]);
        $("#" + gamePattern[i]).fadeIn(1500).fadeOut(150).fadeIn(150);
      }, delay * i);
    }
  }
  
  //### ### //
}

//helper function to set textContent of #level-text
function setLevelText() {
  $("#level-title").text("Level " + level);
}

/* Function: add pressed class to clicked button for UX
Param: currentButton: $(this).attr("id")
Returns: void
DOES: jQuery addClass/removeClass after 100ms */
function animatePress(currentButton) {
  $("#" + currentButton).addClass("pressed");
  setTimeout(function () {
    $("#" + currentButton).removeClass("pressed");
  }, 100);
}

// //not messing with sound effects
// function playSound(name) {
//   // var audio = new Audio("sounds/" + name + ".mp3");
//   // audio.play();
// }

/* Function: reset variables
Param, returns: void */
function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

/* Function: toggles between layouts, normal mode/hard mode
Param, returns: void;
DOES: toggle display of "hard-mode" buttons */
function toggleMode() {

  if (hardMode === true) {
    $(".hard-mode").css("display", "flex");
  } else {
    $(".hard-mode").css("display", "none");
  }
}
