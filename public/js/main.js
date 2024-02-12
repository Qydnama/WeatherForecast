document.getElementById('weatherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var none = document.getElementById("none");
    if (none.classList.contains('d-none')) {
        none.classList.toggle("d-none");
    }
    let city = document.getElementById('cityName').value;
    //Change if city is Astana because one api doesnt support Astana
    if (city == "Astana") city = "Nur-Sultan"
    fetchWeather(city);
    fetchCity(city);
    fetch14DayWeatherForecast(city);
});


async function fetchWeather(city) {
    await axios.get(`/openweather/${city}`)
    .then(responce => {
        const data = responce.data;
        displayWeatherData(data);
    }).catch((err) => {
        alert('Openweather: ',err);
    })
}

function displayWeatherData(data) {
    document.getElementById('weatherCity').textContent = `Weather in ${data.name}`;
    document.getElementById('weatherDescription').textContent = `${data.weather[0].description}`;
    document.getElementById('weatherTemperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('weatherWind').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weatherHumidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('weatherPressure').textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weatherPressure').textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weatherClouds').textContent = `Cloudiness: ${data.clouds.all}%`;
    document.getElementById('weatherSunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('weatherSunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

    initMap(data.coord.lat, data.coord.lon);
}

let map; 
    
function initMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 13);
    }
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    L.marker([lat, lon]).addTo(map)
    .bindPopup('Location of the searched city')
    .openPopup();
}

async function fetchCity(city) {
    await axios.get(`/city/${city}`)
    .then(responce => {
        const cityData = responce.data;
        displayCityData(cityData);
    }).catch((err) => {
        alert('Ninjas-City: ', err);
    })
}

function displayCityData(cityData) {
    document.getElementById('city_name').textContent = `City: ${cityData.name}`;
    document.getElementById('cityCountry').textContent = `Country: ${cityData.country}`;
    document.getElementById('cityIsCapital').textContent = `Is Capital: ${cityData.is_capital}`;
    document.getElementById('cityLat').textContent = `Latitude: ${cityData.latitude}`;
    document.getElementById('cityLong').textContent = `Longtitude: ${cityData.longitude}`;
    document.getElementById('cityPopulation').textContent = `City populatin: ${cityData.population}`;

}




async function fetch14DayWeatherForecast(city) {
    await axios.get(`/weatherbit/forecast/${city}`)
    .then(response => {
        const forecastData = response.data;
        display14DayWeatherForecast(forecastData);
    })
    .catch(error => {
        console.error("Error fetching 14-day forecast data:", error);
    });
}

    
function display14DayWeatherForecast(data) {
    const forecastTableBody = document.getElementById('forecastTableBody');
    forecastTableBody.innerHTML = '';
    
    data.data.forEach((dayData, index) => {
        if (index === 0 || index === 1) {
            return;
        }
        
        const date = dayData.valid_date;
        const highTemp = dayData.max_temp;
        const lowTemp = dayData.min_temp;
        const windSpeed = dayData.wind_spd;
        const humidity = dayData.rh;
        const weatherConditionCode = dayData.weather.code;
        
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        
        const tempCell = document.createElement('td');
        tempCell.textContent = `${highTemp}°C / ${lowTemp}°C`;
        
        const windCell = document.createElement('td');
        windCell.textContent = `${windSpeed} m/s`;
        
        const humidityCell = document.createElement('td');
        humidityCell.textContent = `${humidity}%`;
        
        const weatherIconCell = document.createElement('td');
        const weatherIcon = document.createElement('img');
        const iconBaseUrl = 'https://www.weatherbit.io/static/img/icons/';
        const iconUrl = `${iconBaseUrl}${dayData.weather.icon}.png`;
        
        weatherIcon.src = iconUrl;
        weatherIcon.alt = 'Weather Icon';
        weatherIcon.className = 'weather-icon';
        
        weatherIconCell.appendChild(weatherIcon);
        
        row.appendChild(dateCell);
        row.appendChild(tempCell);
        row.appendChild(windCell);
        row.appendChild(humidityCell);
        row.appendChild(weatherIconCell);
        
        forecastTableBody.appendChild(row);
    });
}
    
function displayWeatherIcons(forecastData) {
    forecastData.forEach(day => {
        const weatherConditionCode = day.weatherConditionCode;
        const iconBaseUrl = 'https://www.weatherbit.io/static/img/icons/';
        const iconUrl = `${iconBaseUrl}${weatherConditionCode}.png`;
    
        document.getElementById(`weatherIcon${day.id}`).src = iconUrl;
    });
}
