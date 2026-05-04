/*
Name: Kendall Beam
Assignment: Term Project 3
Description: Weather widget that dislpays the weather of a given city string
Filename: WeatherWidget.jsx
Date: May 3 2026

AI Use:
-- **Generated** with very specific instructions
*/
import { useEffect, useState } from "react";

const KEY = import.meta.env.VITE_WEATHER_KEY;

/**
 * **Generated Code**
 * @param {*} timestamp sys.sunrise or .sunset || unix, UTC
 * @param {*} timezoneOffset weather.timezone || Shift in seconds from UTC
 * @returns {Date} 
 * @description helper function to display time
 */
function formatLocalTime(timestamp, timezoneOffset) {
    return new Date((timestamp + timezoneOffset) * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC", // <= this needs to be here, otherwise will show the opposite
    });
}


/**
 * **Generated Code**
 * @param {*} weather parsed json returned by openweather api
 * @returns {Object} { label: "sunrise" || "sunset", value= 12hr time }
 * Finds out whether sunrise or sunset 
 */
function getNextSolarEvent(weather) {
    const nowUtcSeconds = Math.floor(Date.now() / 1000);
    const sunrise = weather.sys?.sunrise;
    const sunset = weather.sys?.sunset;

    if (typeof sunrise !== "number" || typeof sunset !== "number") {
        return null;
    }

    // sunrise/sunset are provided as UTC epoch seconds.
    // Compare against current UTC seconds (nowUtcSeconds) to decide
    // which upcoming solar event applies.
    if (nowUtcSeconds < sunrise) {
        return { label: "Sunrise", value: sunrise };
    }

    if (nowUtcSeconds < sunset) {
        return { label: "Sunset", value: sunset };
    }

    return { label: "Sunrise", value: sunrise + 86400 };
}

/**
 * **Generated Code**
 * @param {String} label what goes in label field
 * @param {} value what goes in value field
 * @returns {JSX.Element} containing 2 spans
 * @description
 * Recallable component function to keep code as 1 liners
 */
function WeatherStat({ label, value }) {
    return (
        <div className="weather-stat">
            <span className="weather-stat__label">{label}</span>
            <span className="weather-stat__value">{value}</span>
        </div>
    );
}

/**
 * **Generated Code**
 * @param {String} main (weather.main)
 * @returns an <svg> element based on the description. default = cloud
 * @description
 * Esentially a fancy switch statement
 * That chooses an svg for the right weather
 */
function WeatherIcon({ main }) {
    const key = (main || "").toLowerCase();

    if (key.includes("clear")) {
        return (
            <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="12" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="32" y1="6" x2="32" y2="16" />
                    <line x1="32" y1="48" x2="32" y2="58" />
                    <line x1="6" y1="32" x2="16" y2="32" />
                    <line x1="48" y1="32" x2="58" y2="32" />
                    <line x1="12" y1="12" x2="18" y2="18" />
                    <line x1="46" y1="46" x2="52" y2="52" />
                    <line x1="12" y1="52" x2="18" y2="46" />
                    <line x1="46" y1="18" x2="52" y2="12" />
                </g>
            </svg>
        );
    }

    if (key.includes("cloud")) {
        return (
            <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
                <path d="M20 40h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2 10 10 0 0 0-1 22z" fill="currentColor" opacity="0.12" />
                <path d="M20 40h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2 10 10 0 0 0-1 22z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (key.includes("rain") || key.includes("drizzle")) {
        return (
            <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
                <path d="M18 36h30a9 9 0 0 0 0-18 13 13 0 0 0-25-2 9 9 0 0 0-2 20z" fill="currentColor" opacity="0.12" />
                <path d="M18 36h30a9 9 0 0 0 0-18 13 13 0 0 0-25-2 9 9 0 0 0-2 20z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="25" y1="44" x2="23" y2="50" />
                    <line x1="32" y1="44" x2="30" y2="52" />
                    <line x1="41" y1="44" x2="39" y2="50" />
                </g>
            </svg>
        );
    }

    if (key.includes("thunder") || key.includes("storm")) {
        return (
            <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
                <path d="M18 34h28a9 9 0 0 0 0-18 13 13 0 0 0-25-2 9 9 0 0 0-2 20z" fill="currentColor" opacity="0.12" />
                <path d="M18 34h28a9 9 0 0 0 0-18 13 13 0 0 0-25-2 9 9 0 0 0-2 20z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34 38l-6 12h8l-2 10 12-18h-8z" fill="currentColor" />
            </svg>
        );
    }

    if (key.includes("snow")) {
        return (
            <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
                <path d="M18 36h30a9 9 0 0 0 0-18 13 13 0 0 0-25-2 9 9 0 0 0-2 20z" fill="currentColor" opacity="0.12" />
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="24" cy="46" r="2" fill="currentColor" />
                    <circle cx="32" cy="48" r="2" fill="currentColor" />
                    <circle cx="40" cy="46" r="2" fill="currentColor" />
                </g>
            </svg>
        );
    }

    if (key.includes("mist") || key.includes("fog") || key.includes("haze")) {
        return (
            <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="14" y1="36" x2="50" y2="36" />
                    <line x1="12" y1="42" x2="52" y2="42" />
                    <line x1="16" y1="48" x2="48" y2="48" />
                </g>
            </svg>
        );
    }

    // default: simple cloud
    return (
        <svg className="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M20 40h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2 10 10 0 0 0-1 22z" fill="currentColor" opacity="0.12" />
            <path d="M20 40h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2 10 10 0 0 0-1 22z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * **Generated Code**
 * @param {String} city openweather city query parameter e.g. "Hilo" 
 * @returns {JSX.Element} div className="note weather-card"
 * 1) call openweather api
 * 2) configure variables
 * 3) load JSX element and return
 */
export default function WeatherWidget({ city }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /**
     * Calls openweather api
     * If good => setWeather(response) => weather
     */
    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError("");

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},US&units=imperial&appid=${KEY}`, {
            signal: controller.signal,
        })
            .then((response) => response.json().then((data) => ({ response, data })))
            .then(({ response, data }) => {
                if (!response.ok) {
                    throw new Error(data?.message || "Unable to load weather data");
                }

                setWeather(data);
            })
            .catch((fetchError) => {
                if (fetchError.name !== "AbortError") {
                    console.error(fetchError);
                    setError(fetchError.message || "Unable to load weather data");
                }
            })
            .finally(() => {
                setLoading(false);
            });

        return () => controller.abort();
    }, [city]);

    /**
     * Handle edge cases
     */
    if (loading) return <p>Loading Weather...</p>;
    if (error) {
        return (
            <div className="note weather-card card">
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }
    if (!weather) {
        return (
            <div className="note weather-card card">
                <p>Weather data is unavailable.</p>
            </div>
        );
    }

    // Set varaibles beforehand for convienence
    const description = weather.weather?.[0]?.description ?? "Unknown conditions";
    const main = weather.weather?.[0]?.main ?? "Weather";
    const temp = Math.round(weather.main?.temp ?? 0);
    const feelsLike = Math.round(weather.main?.feels_like ?? 0);
    const windSpeed = Math.round((weather.wind?.speed ?? 0) * 10) / 10;
    const humidity = weather.main?.humidity ?? 0;
    const precipitation = weather.rain?.["1h"] ?? weather.snow?.["1h"] ?? 0;
    const timezoneOffset = weather.timezone ?? 0;
    const nextSolarEvent = getNextSolarEvent(weather);
    const nextSolarTime = nextSolarEvent
        ? formatLocalTime(nextSolarEvent.value, timezoneOffset)
        : "--";

    // div to return
    return (
        <div className="note weather-card card">
            <div className="weather-card__content">
                <div className="weather-details">
                    <div className="weather-details__location">
                        <h3>{weather.name}</h3>
                        <p className="weather-details__temp">{temp}°F</p>
                        <p className="weather-details__feels-like">Feels like {feelsLike}°F</p>
                    </div>

                    <div className="weather-details__summary">
                        <WeatherIcon main={main} />
                        <div className="weather-details__summary-copy">
                            <p className="weather-details__main">{main}</p>
                            <p className="weather-details__description">{description}</p>
                        </div>
                    </div>
                </div>

                <div className="weather-stats">
                    <WeatherStat label="Wind" value={`${windSpeed} mph`} />
                    <WeatherStat label="Humidity" value={`${humidity}%`} />
                    <WeatherStat label="1h Precip" value={`${precipitation} mm`} />
                    <WeatherStat
                        label={nextSolarEvent?.label ?? "Sunrise/Sunset"}
                        value={nextSolarTime}
                    />
                </div>
            </div>
        </div>
    );
}