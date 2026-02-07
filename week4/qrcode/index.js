/* INFO
Name: Kendall Beam
Date: Feb 6 2026
Course: ICS 385 Week 4b
File: index.js (main)
Purpose: 
- Generates a QR code image from user input.
-- add features to improve user experience:
  --- implement @inquirer/prompts for 
  --- url input validation
  --- choice to save as png or svg
  --- choice to save to /Desktop or /Pictures
  --- safe file name based on link 


AI Use:
  Implementing regex check for url validation
  Updating TLD regex to work with dual TLDs
*/

import { input, confirm, select } from '@inquirer/prompts';
import qr from "qr-image";
import fs from "fs"; //{ createWriteStream, writeFile }
import path from "path"; //{ join }
import os from 'os'; //{ homedir }



/* Step by step:
1) ask for URL as input
2) ask for png or svg
3) ask for save location
4) ask to confirm details
5) save image according to options
6) print url link to URL.txt
*/

/* 1. ask for URL as input
clean up url with .replace() and .strip
regex test against domainRegex
If good -> continue
*/
// from regex-snippets.com
const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// keep these usable in global scope
let url;
let host;

// ### AI: copilot for implementing regex check
do {
  url = await input({message: `\nType in your URL (e.g. example.com or https://example.com): `});
  host = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split(/[/?#]/)[0];
  if (!domainRegex.test(host)) {
    console.log('Invalid domain. Please enter a valid domain (e.g., example.com).');
  } else {
    break;
  }
} while (true);
// ###

/* 2. Select png or svg
.png -> png
.svg -> svg
*/
const imgType = await select({
  message: `Choose a file type to save as: `, 
  choices: [
    {name: '.png',
      value: 'png',
      description: 'For general use'
    },
    {name: '.svg',
      value: 'svg',
      description: 'For web use'
    }
  ]
});

/* 3. Select save Location
Same Folder -> cwd
Desktop -> user/Desktop
Pictures -> user/Pictures
*/
const saveLocation = await select({
  message: 'Select where to save the QR Code',
  choices: [
    {name: 'Same Folder',
      value: process.cwd(),
      description: 'Default save location'}
    ,
    {name: 'Desktop',
      value: path.join(os.homedir(), 'Desktop'),
      description: 'Will appear on the desktop'}
    ,
    {name: 'Pictures',
      value: path.join(os.homedir(), 'Pictures'),
      description: 'Will save to user/Pictures'}
    ]
});
// may fail if desktop / pictures don't exist or are in different locations


/* remove tld marker at end
// 1.  /\.[a-zA-Z]{2,}$/  '.' then a group of characters at the end
// 1.5 make a group () and repeat need be + to catch .co.uk esque domains
// 2. replace subdomain markers '.' with '-' for file safe string */
const fileName = 'qrcode_' + host.replace(/(?:\.[a-zA-Z]{2,3}\.[a-zA-Z]{2}|\.[a-zA-Z]{2,})$/, '').replace(/\./g, '-');
//AI : Gemini updated /(\.[a-zA-Z]{2,})+$/ to work properly with dual top level domains (the ?: alternation)


/* 4. Show details to user, ask if good or not */
const a = await confirm({message: `Save ${fileName} to ${saveLocation}? `});

// if good: continue
if (a){

  // 5. make img using options
  makeImg(url, imgType, fileName, saveLocation);
  // 6. save link to URL.txt
  saveToFile(url);
}
else {
  //if bad: restart? exit? ask to change?
}


/* global scope error handlers */
// Event: Handle ctrl + c 
process.on('SIGINT', () => {
  console.log('\n👋 until next time!');
  process.exit(0);
});

// Event: Error if uncaught
process.on('uncaughtException', (error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

/* Function: make qr code img
Param: 
  url - string
  imgType - string
  fileName - string 
  saveLocation - string
returns: void
Does: make qr code image at location, print ok (and the location to path) to console
*/
function makeImg(url, imgType, fileName, saveLocation) {
    var qr_svg = qr.image(url, {type: imgType});
    qr_svg.pipe(fs.createWriteStream(path.join(saveLocation, fileName + '.' + imgType)));
    console.log(`\n- ${fileName}.${imgType} has been saved successfully @ ${saveLocation}`);
}

/* Function: save to file
param: url - string
returns: void
does: fs write, print ok to console
*/
function saveToFile(url) {
  fs.writeFile("URL.txt", url, (err) => {
    if (err) throw err;
    console.log("- Check URL.txt for the saved url.\n");
  });
}

/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
