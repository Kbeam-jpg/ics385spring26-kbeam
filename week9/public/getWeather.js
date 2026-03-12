// DOM manip

//Display: Description, Temp, Icon, Humidity, Wind Speed, Cloudiness

async function getWeather() {

    try {
        
        const lat = "lat=" + document.getElementById("latInput").value.trim();
        const lon = "lon=" + document.getElementById("lonInput").value.trim();

        const res = await fetch(`/weather?${lat}&${lon}`);
        if (!res.ok){
            document.getElementById("errorMsg").innerHTML = await res.json;
        }
        const data = await res.json();

        // make coords default name if "" is returned
        const name = data.name ? data.name : `${lat}, ${lon}`; 
        const description = data.weather[0].description;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const wSpeed = data.wind.speed;
        const cloudiness = data.clouds.all;


        
        const testHTML = 'Current weather at ' + name + '<br>' +
            'Description: ' + description + '<br>' +
            'Temp: ' + temp + ' °F' +'<br>' +
            'Humidity: ' + humidity + '%' + '<br>' +
            'Wind Speed: ' + wSpeed + ' mph' + '<br>' +
            'Cloudiness: ' + cloudiness + '%'
        ;

        document.getElementById("testing").innerHTML = testHTML;

        // not the url in the docs, but it does work
        document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    }
    catch (error) {
        document.getElementById("errorMsg").innerHTML = "Err: " + error;
    }
  
}