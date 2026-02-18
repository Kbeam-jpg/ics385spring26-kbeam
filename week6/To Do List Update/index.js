//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

// create a date object that requires the date.js file
const date = require(__dirname + "/date.js");

const app = express();

// set an array for the default items in the list
let items = ["Buy Food", "Prepare Food", "Cook Food", "Eat Food", "Clean Plates"];
// set an empty array for new work items
let workItems = ["Show Up", "Get Settled", "Drink Coffee"];

// setup an array for Fun and another for Weekend

// set EJS as the viewing engine to display html
app.set('view engine', 'ejs');

// use body parser to parse html file
app.use(bodyParser.urlencoded({extended: true}));

// use Express to serve or display static files such as images, CSS, JS files etc.
app.use(express.static("public"));

// default html file in web server
app.get("/", function(req, res) {

    //get the system date from the getDate function exported by the date.js file
    let day = date.getDate();
    
    // use EJS render to display the day and the To Do List
    res.render("list", {listTitle: day, newListItems: items});
    
});

// display default to do list on the default root folder
app.post("/", function(req, res) {
    
    // code allows items to be added to the regular list and work list
    let item = req.body.newItem;
    
    // if route is /work, add to work list
  // if list === Fun then go to /fun
  // if list ==== Weekend then go to /weekend
  
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } 
    
    else {
        items.push(item);
        res.redirect("/");
    }
});

// display work to do list @ localhost:3000/work
app.get("/work", function(req, res){

//   let day = date.getDate();
  
    res.render("list", {listTitle: "Work Items To-Do List", newListItems: workItems});
});

/* add a app.get for new routes - /chores and /camping
Week6a - todolistv1 -> add new EJS content*/
//### Additions ###

let choreItems = ["Wash Dishes", "Fold Laundry", "Clean Bathroom", "Meal Prep"];
// chores to do list @ localhost:3000/chores
// get -> page load on 3000/chores
// does -> add/replace list with chore list ^^ 
app.get("/chores", function(req, res){

    // view: list
    // content: listTitle in purple bar, chore list in box
    res.render("list", {listTitle: "Chores To-Do List", newListItems: choreItems});
});

let campingItems = ["Pitch Tent", "Setup Gear", "Kick Back", "Have Fun"];
// camping to do list @ localhost:3000/camping
// get -> page load on 3000/camping
// does -> add/replace list with camping list ^^ 
app.get("/camping", function(req, res) {

    res.render("list", {listTitle: "Camping To-Do List", newListItems: campingItems});
});


//### ###
//
//

app.listen(3000, function() {
console.log ("Server is running on port 3000")
});