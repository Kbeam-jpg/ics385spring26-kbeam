//jshint esversion:6

/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 4 - Assignment 4a - Basic NodeJS 
GOAL: extend code to: import npm modules, save to 5 files
FILENAME: index.js
DATE: 2/3/2026
*/
// CHANGES ### ### <- within these
/* SCRIPT
  a) import and get strings
  b) spin up http server
  c) if OK
      - give response
      - save to txt files
*/


// 1. import superheroes, get random name
const superheroes = require('superheroes');
var mySuperHeroName = superheroes.random();
console.log(mySuperHeroName);

// 2. import supervillans, get random name
const supervillains = require('supervillains');
var mySuperVillainName = supervillains.random();
console.log(mySuperVillainName);

// 3. import inspirational quote, get random quote
const Quote = require('inspirational-quotes');
var myQuote = Quote.getRandomQuote();
console.log(myQuote);

//### 2/3/26 ### 
// 4. import movie quotes module, get random quote
const movieQuote = require("popular-movie-quotes");
var movQuote = movieQuote.getRandomQuote();
console.log(movQuote);

//5. import famous last words, get random quote
const famousLastWords = require('famous-last-words');
const randIndex = Math.floor(Math.random() * famousLastWords.length);
// index: random num from 0 to 34 - length of famousLastWords array = 35
var lastWords = famousLastWords[randIndex];
console.log(lastWords);
//### ### 

// creates a local web server and displays the above variables
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

  // res.writeHead(http code, header object);
  res.statusCode = 200;
  // ### added charset=utf=8 to make apostrophes and the like render properly ###
  res.setHeader('Content-Type', 'text/plain ; charset=utf=8'); 

  // writing header response to http server
  // ### added movie quote & last words ###
  res.end("Super Hero: " + mySuperHeroName + "\n\nSuper Villain: " + mySuperVillainName + "\n\nQuote of the Day: " + myQuote + "\n\nRelevant Movie Quote: " + movQuote + "\n\nVillans Last Words: " + lastWords);

  //import fs when needed
  const fs = require("fs");
    
  // ### 2/3/26 ###
  //* note: will only write files when webpage is visited */
  
  //fs.writeFileSync(file desc, content)
  fs.writeFileSync("file1.txt", "Super Hero:\n" + mySuperHeroName);
  fs.writeFileSync("file2.txt", "Super Villain:\n" + mySuperVillainName);
  fs.writeFileSync("file3.txt", "Quote of the Day:\n" + myQuote);
  fs.writeFileSync("file4.txt", "Relevant Movie Quote:\n" + movQuote);
  fs.writeFileSync("file5.txt", "Villans Last Words:\n" + lastWords);
  //also, will overwrite the file if exists already
  // ### ###
});

// console feedback that server is running and where
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});