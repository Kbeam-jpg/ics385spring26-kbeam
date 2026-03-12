# Quick Start:

```
1) make .env file, include your API key (OPEN_WEATHER_API_KEY=)
(see .env.example for expected template)

2) 
/*cd cwd*/
npm install
node server.js
```

## Overview
 1) enter decimal degrees
 2) push button
 3) be happy


### Structure
```
Server.js -> serve /public 
    |-> .env        -> index.html
                    -> getWeather.js
                    -> styles.css

 dependencies => dotenv, express
```