
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
// returns: 
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// helper function to concatonate "images/dice" + ".png"
// params: number
// returns: "images/dice" + number + ".png"
function findDiceImg(num) {
    return "images/dice" + num + ".png";
}

//main code


// roll nums
var randomNum1 = rollDice();
var randomNum2 = rollDice();
var randomNum3 = rollDice();

// // vars = concatonate "images/dice" + randNum + ".png"
// var rndImgSrc1 = findDiceImg(randomNum1);
// var rndImgSrc2 = findDiceImg(randomNum2);

// // set attribute for img1/img2 in index.html
// document.querySelectorAll("img")[0].setAttribute("src", rndImgSrc1);
// document.querySelectorAll("img")[1].setAttribute("src", rndImgSrc2);

//animate dice roll
animateDiceRoll(document.querySelectorAll("img")[0], randomNum1);
animateDiceRoll(document.querySelectorAll("img")[1], randomNum2);
animateDiceRoll(document.querySelectorAll("img")[2], randomNum3);

//logic for updating title
//compare, change h1 attribute to outcome

//wait until animation is done (600ms)
setTimeout(() => {
    //p1 wins
    if (randomNum1 > randomNum2) {
        document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
    }
    //p2 wins
    else if (randomNum1 < randomNum2) {
        document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
    }
    //draw
    else {
        document.querySelector("h1").innerHTML = "Draw!";
    }
}, 600);


