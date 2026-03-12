/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 9 - Assignment 9c - Weather API
GOAL: work with api's and a .env file
FILENAME: getWeather.js (client)
DATE: 3/12/2026

script: validate input -> server request -> make card -> reveal
        + change tab icon (thanks stackoverflow)

AI use: pointing out stupid bugs
*/
async function getWeather() {

    const submitBtn = document.getElementById("submitBtn");
    const errMsg = document.getElementById("errorMsg");
    const weatherCard = document.getElementById("weatherCard");

    try {

        // revoke button permissions
        submitBtn.disabled = true;
        submitBtn.style.cursor = "wait";
     

        const latInput = "" + document.getElementById("latInput").value.trim();
        const lonInput = "" + document.getElementById("lonInput").value.trim();

        // hide display for reset
        weatherCard.style.display = 'none';
        errMsg.style.display = 'none';


        //error handling
        if (!latInput || !lonInput) {
            displayError(errMsg, "Please enter both latitude and longitude");
            resetButton(submitBtn);
            return;
        }
        const check = validCoordinates(latInput, lonInput);
        if (!check.isValid){
            displayError(errMsg, check.error);
            resetButton(submitBtn);
            return;
        }


        // make request
        const res = await fetch(`/weather?lat=${check.LAT}&lon=${check.LON}`);
        if (!res.ok){
            const err = await res.json();
            displayError(errMsg, err.error || "Internal Server Error. Something went wrong.");
            resetButton(submitBtn);
            return;
        }
        const data = await res.json();

        // make coords default name if "" is returned
        const name = data.name ? data.name : `${latInput}°, ${lonInput}°`; 
        const description = data.weather[0].description;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const wSpeed = data.wind.speed;
        const cloudiness = data.clouds.all;

       
        const cardHTML = 
        '<h3 id="locationName" class="location">Weather for '+ name + '</h3>' +
        '<div class="weather-header">' +
            '<div>' +
                '<p><strong> '+ temp+'°F</strong></p>' +
                '<p class="description"> '+ description + '</p>' +
            '</div>' +
        '</div>' +
        '<hr>' +
        '<p><strong>Humidity:</strong> ' + humidity+'%</p>' +
        '<p><strong>Wind Speed:</strong> ' + wSpeed + 'mph</p>' +
        '<p><strong>Cloudiness:</strong> ' + cloudiness+'%</p>';

        document.getElementById("weatherContent").innerHTML = cardHTML;

        // not the url in the docs, but it does work
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // browser makes two get requests here
        // maybe better to save the img locally?
        document.getElementById("icon").src = iconUrl;
        changeFavicon(iconUrl);

        // show the card
        weatherCard.style.display = 'block';
        // give button back
        resetButton(submitBtn);

    } catch (error) {
        displayError(errMsg, "Error: something went wrong.");
        resetButton(submitBtn);
    }
  
}

function validCoordinates(latString, lonString){

    /**
     * - 0 or 1 negative sign
     * - 1 or more digits 0-9
     * - group 0 or 1 time
     * -> (decimal, then 1 or more digits 0-9)
     */
    const decimalRegex = /^-?\d+(\.\d+)?$/

    // regex check
    if (!decimalRegex.test(latString) || !decimalRegex.test(lonString)) {
        return {
            isValid: false,
            error: "Invalid Characters. Enter a a decimal number i.e. -10.23"
        };
    }

    //parse for compares
    const lat = parseFloat(latString);
    const lon = parseFloat(lonString);

    //check bounds
    if (lat < -90 || lat > 90){
        return {
            isValid: false,
            error: "Latitude must be between ±90.00"
        }
    }
    if (lon < -180 || lon > 180){
        return {
            isValid: false,
            error: "Longitude must be between ±180.00"
        }
    }

    // if good
    return {
        isValid: true,
        LAT: "" + lat.toFixed(4),
        LON: "" + lon.toFixed(4)
    }
}

//helper functions
/**
 * @param {HTMLElement} div DOM reference to div 
 * @param {string} msg error string
 */
function displayError(div, msg) {
    div.textContent = msg;
    div.style.display = 'block'; 
}
/**
 * @param {*} submitBtn DOM reference to button
 */
function resetButton(submitBtn) {
    submitBtn.disabled = false;
    submitBtn.style.cursor = "pointer";
}

/**
 * 
 * @param {string} imgUrl of a url
 * @does change favicon to the icon
 */
function changeFavicon(imgUrl) {

    if (typeof window === 'undefined') return;

    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        document.head.appendChild(link);
    }
    // if found -> set href
    link.href = imgUrl;
}