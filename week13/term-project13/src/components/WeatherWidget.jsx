import {useState, useEffect } from "react";
const KEY = import.meta.env.VITE_WEATHER_KEY;

export default function WeatherWidget({city}) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/weather` 
            + `?q=${city},US&units=imperial&appid=${KEY}`)
            .then(r => r.json())
            .then(d => { setWeather(d); setLoading(false); })
            .catch(e => console.error(e));
    }, [city]); // <= fetch when changes?

    if (loading) return <p>Loading Weather...</p>;

    // desc = weather.weather[0].description;

    return (
        <div className="note weather-card">
            <h3>{weather.name}</h3>
            {/* <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}  alt={`${desc} icon`}/> */}
            <p>{Math.round(weather.main.temp)}°F -- {weather.weather[0].description}</p>
        </div>
    );
}