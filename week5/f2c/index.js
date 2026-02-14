/* INFO
Name: Kendall Beam
Date: Feb 13 2026
Course: ICS 385 Week 5b
File: index.js (main)
Purpose: 
- Use express to handle get/post html requests
- implement a basic function
- see f2cCalc.html

AI Use: none
*/
// make app object from express module
const express = require("express");
const app = express();

//middleware?
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ####

// Path : /f2c
// get -> send f2cCalc.html file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/f2cCalc.html");
});

// on submit button
// post -> send header
// *** no input validation <- errors as NaN
app.post("/f2c", function (req, res) {
  //converts the string input to an int
  var F_temp = parseInt(req.body.Fahrenheit);

  // do temp conversion
  var C_temp = ((F_temp - 32) * 5) / 9;

  //display the result
  res.send(`${F_temp}F is ${C_temp}C`);
});

//####

/* 
No req for a home page
so handling initial boot
Just add "/f2c" at the end of the url
*/
// get -> send html form and sumbit button
app.get("/", function (req, res) {
  // res.send("app exists at /f2c ");
  res.send(
    '<form action="/" method="post"><button type="submit">go to /f2c</button></form>'
  );
});
// post -> (broken) redirect to /f2c path
app.post("/", function (req, res) {
  res.send('Just type in "/f2c" at the end of the url');
  /*
    I want to redirect to the /f2c path
    I don't know what to put here
    */
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
