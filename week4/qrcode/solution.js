/*
Name: Kendall Beam
Date: Feb 6 2026
Course: ICS 385 Week 4b
File: index.js
Purpose: 
- Generates a QR code image from user input.
-- Write comments to help explain code

*** See index.js for .js file with updated features

AI Use:
  Wasn't really needed here for comments
*/

/* Step by step:
0) import modules (CLI prompts, qr generator, file system)
1) ask for URL as input
2) wait for input
3) make png img
4) save img to qr_img.png in same folder
5) save url to URL.txt in same folder
6) catch any errors
*/

// CLI module: prompts for user input
import inquirer from "inquirer";
// module for making qr code images
import qr from "qr-image";
// base node.js module for file system i/o
import fs from "fs";

// cascading setup so .prompt , .then , .catch can be called 
// on inquirer obj without explicit reference each time
inquirer
  // 1.
  .prompt([
    {
      message: "Type in your URL: ",
      name: "URL",
    },
  ])
  // 2. 
  .then((answers) => {

    // keep constant variable around for multiple use
    const url = answers.URL;

    // 3. 
    // generate image ; default option = {type: png}
    var qr_svg = qr.image(url);
    // 4. 
    // save qr img at filePathDesc = (same folder as script)
    qr_svg.pipe(fs.createWriteStream("qr_img.png"));

    // 5.
    // save url to file
    fs.writeFile("URL.txt", url, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  // 6. 
  // catch(error) is a catch-all
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

/* Notes: 
- will accept garbage inputs, might have a use?
-- it can prompt a google search for whoevers reading it
- no feedback on what errors might be
*/
