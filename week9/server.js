/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 9 - Assignment 9c - Weather API
GOAL: work with api's and a .env file
FILENAME: server.js (backend)
DATE: 3/12/2026

AI use: pointing out stupid bugs
*/

import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public')); //serve html and js in /public
app.use(express.json());// working w/ json

// add backup data

// weather end point
// expects ?lat={lat}&lon={lon}
app.get("/weather", async (req, res) => {

    console.log(`request made from: ${req.hostname}, ${req.method}`);

    const units = 'imperial';
    const API_KEY = process.env.OPEN_WEATHER_API_KEY;
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
  
    try {
        // get values from query
        // ?lat={lat}&lon={lon}
        const {lat, lon} = req.query; //string 20.98 string -156.67

        // build url
        const url = `${baseUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`; //works

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok){
            return res.status(response.status).json(
                {error: `Weather API error: ${response.statusText}. Possibly double check your API key in ./.env`}
            );
        }
        const data = await response.json();

        res.json(data);


    } catch (error) {
        //print error to console
        console.log(error);
        res.status(500).json({error: 'Internal Server Error. Something went wrong.'});
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
