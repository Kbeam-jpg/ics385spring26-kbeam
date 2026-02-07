# qrcode (ICS 385 Week 4 / Assignment 4b)
## Overview
CLI that generates QR codes from user input (URL or text) using Node.js. Allows saving as png/svg & selecting save location

## Setup
npm install

## How to Run
node index.js
- Menus are navigated with Up/Down keys and Enter key

## New Features Added (Design)
1) Updated to @inquirer/prompts
    - as inquirer module is depricated
2) Allows save as png or svg
3) Input string sanitization (check if url)
4) File naming based on provided link
5) Choose saving location
- Options:
    -   Same folder (default)
    -   to Desktop
    -   Pictures/
6) handle crtl + c "gracefully"
        

## Testing
- Test 1: (solution.js initial) Entered URL for nodejs.com
    - Expected: qr_img.png reads as nodejs.com, outputs "https://www.npmjs.com/" to URL.txt
    - Actual: qr_img.png correctly points to link, URL.txt was correctly updated

- Test 2: (index.js initial) -- batch test functionality | Options: https://www.w3schools.com/nodejs/nodejs_os.asp , svg, Desktop, Y
    - Expected: 'qrcode_w3schools.svg' saved to desktop
    - Actual: saved to desktop, is readable and directs to the right page

- Test 3: (index.js) -- test dual tld regex
| Options: https://www.google.co.uk/index.html , png, Pictures, Enter 
    - Expected: 'qrcode_google.png' saved to /Pictures
    - Actual: saved to /Pictures, is readable and directs to google.co.uk

## AI Attribution
- Tools used: Github Copilot, Gemini 3 Pro
- Files/Sections generated or modified by AI: index.js -> Regex filters
- What I personally changed/verified:
    - comments for solution.js
    - index.js -> algorithm, comments, testing, etc,

## Reflection (Manager Notes)
- What my manager requested:
    - understand the code, update it, make it user friendly
- What I learned: 
    - JS regex notation, @inquirer basics, simple path/os module utility
- Next improvements I would make: 
    - allow user to go back and change options if selected N at the end
    - file overwrite detection -> save as file\[1\].png or file\[n\].svg depending
    - colors/styling options for qr code-> color, dot shape, size
    - better @inquirer prompts?