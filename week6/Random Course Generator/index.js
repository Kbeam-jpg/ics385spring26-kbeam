import express from "express";
import bodyParser from "body-parser";

import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//keep these in global scope
var dataIds;
var courseNames;


function readCourses(req, res, next) {

  try {
    // Read file synchronously
    const data = fs.readFileSync('cid.txt', 'utf8');
    dataIds = data.split(/\n/);
    for (let i = 0; i < dataIds.length-5; i++){
      dataIds[i] = dataIds[i].split(', ');
    };
    // console.log('File content:', dataIds);

    const course = fs.readFileSync('cname.txt', 'utf8');
    courseNames = course.split(/\n/);
    // console.log('File content:', courseNames);

  } catch (err) {
    console.error('Error reading file:', err);
  } 

  next();
};
app.use(readCourses);



app.get("/", (req, res) => {
  res.render("solution.ejs");
});

app.post("/submit", (req, res) => {

  for (let i = 0; i <= 50; i++){
  //gen a number between 50 and 500
  const randID = Math.floor(Math.random() * 450 + 50);

  const tagIndex = Math.floor(Math.random() * (dataIds.length-5));
  console.log(tagIndex);
  console.log([dataIds[tagIndex][0]]);
  console.log([dataIds[tagIndex][1]]);
  const randTag = dataIds[tagIndex][0];

  const nameIndex = Math.floor(Math.random() * (courseNames.length-5));
  let randName = courseNames[nameIndex];

  console.log(`${randTag} ${randID} - ${randName}`);

  // roll from 0 to 100%
  const isIntro = Math.floor(Math.random() * 100);


  // Variety Checks
  // low level - 30% intro
  // middle - 20% intro
  // high - 50% capstone

  // for lower level classes
  if (randID < 200){
    // is Intro 30% of the time -> make "Intro to" + "Major Name" as course name
    if (isIntro <= 30){
      randName = "Intro to " + dataIds[tagIndex][1];
    }
  }
  else if (randID < 350){
    // 20% of the time add "Intro to" to randName
    if (isIntro <= 20){
      randName = "Intro to " + randName;
    }
  }
  else if (randID > 450){
    //30% chance high level class is Capstone
    if (isIntro <= 30){
      randName = `${dataIds[tagIndex][1]} Capstone`
    }
  }
  
  console.log(`${randTag} ${randID} - ${randName}`);
}
  // res.render("solution.ejs", {
  //   adjective: randNum + " " + randID,
  //   noun: randCourse,
  // });

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});