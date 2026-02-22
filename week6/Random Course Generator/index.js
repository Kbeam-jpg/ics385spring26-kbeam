/* INFO
Name: Kendall Beam
Date: Feb 21 2026
Course: ICS 385 Week 6b
File: index.js (main)
Purpose: randomly generate course string
-- middleware to read files and make arrays
-- logic to add "Intro to" or "Capstone" to some courses
-- res.render string to work w/ EJS

AI Use:
  none
*/

import express from "express";
import bodyParser from "body-parser";

import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//keep these in global scope
var dataIds; // dataIds -> [[ID, Type]] 
var courseNames; // courseNames -> [string]

/* Read files synchronously
middleware to load text file contents into arrays
uses: fs module
does: make arays from readFile contents from cid.txt and cname.txt
*/
function readCourses(req, res, next) {
  try {

    // dataIds
    const data = fs.readFileSync('cid.txt', 'utf8');
    //make array <- split on newline
    dataIds = data.split(/\n/);
    //make 2D array <- split items on comma
    for (let i = 0; i < dataIds.length-5; i++){
      dataIds[i] = dataIds[i].split(', ');
    };
    // console.log('File content:', dataIds);

    // courseNames
    const course = fs.readFileSync('cname.txt', 'utf8');
    courseNames = course.split(/\n/);
    // console.log('File content:', courseNames);

  } catch (err) {
    console.error('Error reading file:', err);
  } 
  next();
};
app.use(readCourses);


/* on GET -> send index.ejs */
app.get("/", (req, res) => {
  res.render("index.ejs");
});

/* on POST -> render random string
- 4 rand nums: course number, major type, major desc, isIntro
-- variety check - % chance to add 'intro' or 'capstone'
send -> res.render generatedName string
*/
app.post("/submit", (req, res) => {

  //get course number between 50 and 500
  const randID = Math.floor(Math.random() * 450 + 50);

  // get course type 
  const tagIndex = Math.floor(Math.random() * (dataIds.length-5)); // <- don't need the last 5 lines
  const randTag = dataIds[tagIndex][0];
  console.log(tagIndex);
  console.log([dataIds[tagIndex][0]]);
  console.log([dataIds[tagIndex][1]]);

  // get course name
  const nameIndex = Math.floor(Math.random() * (courseNames.length-5)); // <- don't need the last 5 lines
  let randName = courseNames[nameIndex];

  console.log(`Before: ${randTag} ${randID} - ${randName}`);

  // roll from 0 to 100%
  const isIntro = Math.floor(Math.random() * 100);


  // ### Variety Checks
  // -- because I don't want to manually fix cname.txt
  // low level - 25% intro class
  // mid level - 20% intro class
  // high level - 33% capstone class

  //to do: add the like 101v for project or 101L for lab

  // for lower level classes
  if (randID < 200){
    // is Intro 250% of the time -> make "Intro to" + "Major Name" as course name
    if (isIntro <= 25){
      randName = "Intro to " + dataIds[tagIndex][1];
    }
  }
  // for low - mid level classes
  else if (randID < 350){
    // 20% of the time add "Intro to" to randName
    if (isIntro <= 20){
      randName = "Intro to " + randName;
    }
  }
  else if (randID > 450){
    // 30% chance high level class is Capstone
    if (isIntro <= 33){
      randName = `${dataIds[tagIndex][1]} Capstone`
    }
  }
  // ### 
  
  console.log(`After: ${randTag} ${randID} - ${randName}`);

  //just send one string, no need to be extra
  var randCourse = `${randTag} ${randID} - ${randName}`;

  res.render("index.ejs", {
    generatedName: randCourse,
  });

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});