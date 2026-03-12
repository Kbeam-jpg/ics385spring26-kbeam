import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public')); //serve html and js in /public
app.use(express.json());// working w/ json


// weather end point
// expects ?lat={lat}&lon={lon}
app.get("/weather", async (req, res) => {

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
