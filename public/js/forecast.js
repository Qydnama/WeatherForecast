const localization = {
    en: {
        temperature: "Temperature (°C)",
        windSpeed: "Wind Speed (м/с)",
        humidity: "Humidity (%)",
        
        weatherIn: "Weather in: ",
        condition: "Condition: ",
        temperature: "Temperature (°C): ",
        pressure: "Pressure (hPa): ",
        cloudiness: "Cloudiness (%): ",
        sunrise: "Sunrise: ",
        sunset: "Sunset: ",
        
        city: "City: ",
        country: "Country: ",
        isCapital: "Is Capital: ",
        latitude: "Latitude: ",
        longitude : "Longitude: ",
        cityPopulation: "City Population: ",

        date: "Date: ",
        minMaxTemperature: "Min/Max Temperature (°C): ",
        windSpeed: "Wind Speed (m/s): ",
        humidity: "Humidity (%): ",
        weatherState: "Weather State: ",
        noWeatherDataAvailible: "No weather data availible"
    },
    ru: {
        temperature: "Температура (°C)",
        windSpeed: "Скорость ветра (м/с)",
        humidity: "Влажность (%)",

        weatherIn: "Погода в: ",
        condition: "Состояние: ",
        temperature: "Температура (°C): ",
        pressure: "Давление (hPa): ",
        cloudiness: "Облачность (%): ",
        sunrise: "Рассвет: ",
        sunset: "Закат: ",

        city: "Город: ",
        country: "Страна: ",
        isCapital: "Столица?: ",
        latitude: "Широта: ",
        longitude : "Долгота: ",
        cityPopulation: "Популяция: ",
        
        date: "Дата: ",
        minMaxTemperature: "Макс/Мин Температура (°C): ",
        windSpeed: "Скорость Ветра (м/с): ",
        humidity: "Влажность (%): ",
        weatherState: "Состояние Погоды: ",
        noWeatherDataAvailible: "Нету данных о погоде",
    }
};

const currentLang = document.documentElement.lang;

let temperatureChart;
let windSpeedChart;
let humidityChart;


document.getElementById('weatherForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    clearWeatherData();


    let city = document.getElementById('cityName').value;
    let ninjasCity = city
    if (!isCityNameInEnglish(city)) {
        alert("Пожалуйста, напишите название города на английском языке.");
        return;
    }
    var none = document.getElementById("none");
    if (none.classList.contains('d-none')) {
        none.classList.toggle("d-none");
    }
    //Change if city is Astana because one API doesn't support Astana
    if (city == "Astana") ninjasCity = "Nur-Sultan";

    try {
        let openWeatherData = await fetchWeather(city);
        let ninjasCityData = await fetchCity(ninjasCity);
        let weatherBitData = await fetch16DayWeatherForecast(city);
        let allData = {
            currentWeather: openWeatherData,
            cityInfo: ninjasCityData,
            forecast16Days: weatherBitData
        };

        displayChart(weatherBitData);
        sendDataToServer(allData);
    } catch (error) {
        console.error("Ошибка при получении данных: ", error);
        alert("Произошла ошибка при получении данных. Подробности в консоли.");
    }
});

async function sendDataToServer(data) {
    await axios.post(`/forecast`, data)
    .catch((err) => {
        alert(`SendDataToServer ${err}`);
    })
}

function isCityNameInEnglish(cityName) {
    const englishAlphabetRegex = /^[A-Za-z\s]+$/;
    return englishAlphabetRegex.test(cityName);
}

async function fetchWeather(city) {
    let data;
    await axios.get(`/forecast/openweather/${city}?lang=${currentLang}`)
    .then(response => {
        data = response.data;
        displayWeatherData(data);
    }).catch((err) => {
        alert(`Error: ${err}`);
    });
    return data;
}


function displayWeatherData(data) {
    document.getElementById('weatherCity').textContent += `${data.name}`;
    document.getElementById('weatherDescription').textContent += `${data.weather[0].description}`;
    document.getElementById('weatherTemperature').textContent += `${data.main.temp}`;
    document.getElementById('weatherWind').textContent += `${data.wind.speed}`;
    document.getElementById('weatherHumidity').textContent += `${data.main.humidity}`;
    document.getElementById('weatherPressure').textContent += `${data.main.pressure} `;
    document.getElementById('weatherClouds').textContent += `${data.clouds.all}`;
    document.getElementById('weatherSunrise').textContent += `${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('weatherSunset').textContent += `${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

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
    let cityData;
    await axios.get(`/forecast/city/${city}?lang=${currentLang}`)
    .then(response => {
        cityData = response.data
        displayCityData(cityData);
        return cityData
    }).catch((err) => {
        alert(`FetchCity: ${err}`);
    })
    return cityData
}

function displayCityData(cityData) {
    document.getElementById('city_name').textContent += `${cityData.name}`;
    document.getElementById('cityCountry').textContent += `${cityData.country}`;
    document.getElementById('cityIsCapital').textContent += `${cityData.is_capital}`;
    document.getElementById('cityLat').textContent += `${cityData.latitude}`;
    document.getElementById('cityLong').textContent += `${cityData.longitude}`;
    document.getElementById('cityPopulation').textContent += ` ${cityData.population}`;

}




async function fetch16DayWeatherForecast(city) {
    let forecastData;
    await axios.get(`/forecast/weatherbit/forecast/${city}?lang=${currentLang}`)
    .then(response => {
        forecastData = response.data;
        display16DayWeatherForecast(forecastData);
    })
    .catch(error => {
        console.error("Error fetching 16-day forecast data:", error);
    });
    return forecastData
}

    
function display16DayWeatherForecast(data) {
    const forecastTableBody = document.getElementById('forecastTableBody');
    forecastTableBody.innerHTML = '';
    
    data.data.forEach((dayData, index) => {        
        const date = dayData.valid_date;
        const highTemp = dayData.max_temp;
        const lowTemp = dayData.min_temp;
        const windSpeed = dayData.wind_spd;
        const humidity = dayData.rh;
        
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

function displayChart(weatherBitData) {
    const dates = weatherBitData.data.map(item => item.valid_date);
    const temps = weatherBitData.data.map(item => item.temp);
    const windSpeeds = weatherBitData.data.map(item => item.wind_spd);
    const humidity = weatherBitData.data.map(item => item.rh);


    const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
    if (temperatureChart) temperatureChart.destroy();
    temperatureChart = new Chart(ctxTemperature, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: localization[currentLang].temperature,
                data: temps,
                borderColor: 'red',
                fill: false,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    

    const ctxWindSpeed = document.getElementById('windSpeedChart').getContext('2d');
    if (windSpeedChart) windSpeedChart.destroy();
    windSpeedChart = new Chart(ctxWindSpeed, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: localization[currentLang].windSpeed,
                data: windSpeeds,
                borderColor: 'blue',
                fill: false,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
    if (humidityChart) humidityChart.destroy();
    humidityChart = new Chart(ctxHumidity, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: localization[currentLang].humidity,
                data: humidity,
                borderColor: 'green',
                fill: false,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function clearWeatherData() {

    document.getElementById('weatherCity').textContent = `${localization[currentLang].weatherIn}`;
    document.getElementById('weatherDescription').textContent = `${localization[currentLang].condition}`;
    document.getElementById('weatherTemperature').textContent = `${localization[currentLang].temperature}`;
    document.getElementById('weatherWind').textContent = `${localization[currentLang].windSpeed}`;
    document.getElementById('weatherHumidity').textContent = `${localization[currentLang].humidity}`;
    document.getElementById('weatherPressure').textContent = `${localization[currentLang].pressure}`;
    document.getElementById('weatherClouds').textContent = `${localization[currentLang].cloudiness}`;
    document.getElementById('weatherSunrise').textContent = `${localization[currentLang].sunrise}`;
    document.getElementById('weatherSunset').textContent = `${localization[currentLang].sunset}`;
    document.getElementById('city_name').textContent = `${localization[currentLang].city}`;
    document.getElementById('cityLat').textContent = `${localization[currentLang].latitude}`;
    document.getElementById('cityLong').textContent = `${localization[currentLang].longitude}`;
    document.getElementById('cityCountry').textContent = `${localization[currentLang].country}`;
    document.getElementById('cityPopulation').textContent = `${localization[currentLang].cityPopulation}`;
    document.getElementById('cityIsCapital').textContent = `${localization[currentLang].isCapital}`;
    document.getElementById('forecastTableBody').innerHTML = ``;
}

