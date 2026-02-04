## Week4 - Assignment 4a - hero
```
a simple Node.js server + file i/o
generate skeleton for superhero story?
```

## Overview: 
```
1. grab names / quotes, and print them to console

2. create http server on local host 127...1/3000

3. when visited:
    -- show names / quotes in plain text
    -- print vars to 5 files "file<1-5>.txt"
```
## Structure
```
main: index.js
        \-- http @127.0.0.1/3000
      
Dependencies:
- famous-last-words: ^0.6.0
- inspirational-quotes: ^1.0.8
- popular-movie-quotes: ^1.2.4
- superheroes: ^3.0.0
- supervillains: ^3.0.0
```

## Small Changes: 
```
- added comments to index.js

- added '; charset=utf=8' to setHeader() make apostrophes render right
    -- found from mdn docs

- added movie quote and famous last words to http response

- commit file.txt's are most ironic I could get in like 5 minutes
    -- "tyrant" hero promoting greed
    --  quote related to greed
    -- "fixer" villan dodging UX
```