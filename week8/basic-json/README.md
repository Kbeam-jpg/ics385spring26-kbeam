# Overview
A course catalog, not much to it

## Setup Instructions:
1. running a local server (possibly)
```
    - python3 -m http.server 8080
    - npx serve week8/basic-json
    - open index.html in server view
```
2. Open statically 
```
    open index.html (uses fallback data incase of CORS error)
```
3. Online (github pages)
[@here](https://kbeam-jpg.github.io/ics385spring26-kbeam/week8/basic-json/)


# <hr>    
## Features:
```
- parse .json file from fetch() request 
- filter courses based on filters (search term, department, credits)
- add new courses to the catalog (in same session)
- export session's catalog to .json file

- Error handling for most cases, but not all
```

# <hr>
## Things I had to learn / go over
```
- JSON parse + stringify

- HTML forms
- JS DOM for form elements
- Modals
- Array.map()
- Array.reduce()
- Array.filter()
- typeof Blob

possibly more things that I've forgotten or glossed over
```

# <hr>  
### AI Usage:

    - generating some boilerplate code
    - help with debugging the reduce() function in updateDisplayStats()
    - help inaddFormSubmitted() for parsing checkboxes, array formatting
    - copilot-41 for generating basic CSS with directions
    - Gemini 3 for fixing inital implementation of showCourseDetails where arrays were not previously accounted for

    This was far too much work for just a few days...