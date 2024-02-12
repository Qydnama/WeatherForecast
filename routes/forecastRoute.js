const express = require('express');
const router = express.Router();
const { Forecast } = require('../models/forecast');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const path = require('path');


const { checkAuthenticated } = require('../middleware/authHandler');
router.use(checkAuthenticated);

const { OPEN_WEATHER_API, WEATHERBIT_API, NINJAS_CITY_API } = require('../config/api');


router.get('/history', async (req, res) => { 
    try {
        let requestList = await Forecast.find({userId: req.session.user.id });
        if (!requestList) {
            return res.status(400).send('History doesnt found');

        }
        let isAdmin = req.session.user.isAdmin;
        res.render('forecast/history', { data: requestList, isAdmin: isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching history of requests' });
    }
});

router.get('/history/download-pdf/:id', async (req, res) => {
    try {

        const formatWeatherData = (data) => {
            let formattedString = '';
            formattedString += `Coordinates: Longitude - ${data.coord.lon}, Latitude - ${data.coord.lat}\n`;
            data.weather.forEach((weather, index) => {
                formattedString += `        Weather ${index + 1}: Main - ${weather.main}, Description - ${weather.description}\n`;
            });
            formattedString += `        Temperature: Current - ${data.main.temp}°C, Min - ${data.main.temp_min}°C, Max - ${data.main.temp_max}°C\n`;
            formattedString += `        Wind: Speed - ${data.wind.speed}m/s, Direction - ${data.wind.deg} degrees\n`;
            return formattedString;
        };
        
        const formatCityInfo = (data) => {
            return `Name: ${data.name}\n        Country: ${data.country}\n        Population: ${data.population}\n        Is Capital: ${data.is_capital}\n`;
        };
        
        const formatForecast16Days = (data) => {
            let formattedString = `City: ${data.city_name}, Country: ${data.country_code}\n`;
            data.data.forEach((day, index) => {
                formattedString += `        Day ${index + 1}:\n        Date - ${day.datetime}, \n        Max Temp - ${day.max_temp}°C, \n        Min Temp - ${day.min_temp}°C, \n        Description - ${day.weather.description}\n\n`;
            });
            return formattedString;
        };

        const requestId = req.params.id;
        const forecastData = await Forecast.findById(requestId);
        
        if (!forecastData) {
            return res.status(404).send('Request not found');
        }

        const doc = new PDFDocument();
        let filename = `WeatherRequest_${new Date(forecastData.requestDate).toISOString()}`;
        filename = encodeURIComponent(filename) + '.pdf';

        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        const content = `
        Weather Request Details:
        - Request ID: ${forecastData._id}
        - Request userID: ${forecastData.userId}
        - Request Time: ${new Date(forecastData.requestDate).toLocaleString()}
        - City: ${forecastData.cityInfo.name}
        - Temperature: ${forecastData.currentWeather.main.temp}°C
        - Description: ${forecastData.currentWeather.weather[0].description}

        Current Weather:
        ${formatWeatherData(forecastData.currentWeather)}
        City Info:
        ${formatCityInfo(forecastData.cityInfo)}
        16 Days Forecast:
        ${formatForecast16Days(forecastData.forecast16Days)}
        `;
        doc.font(path.join(__dirname,'../public/fonts/Montserrat-Regular.ttf'));
        doc.y = 300;
        doc.text(content, 50, 50);
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
});

router.post('/', async (req, res) => {
    try {
        const { currentWeather, cityInfo, forecast16Days } = req.body;



        const userId = req.session.user.id;

        let forecast = new Forecast({
            userId,
            currentWeather,
            cityInfo,
            forecast16Days,
            requestDate: new Date()
        });

        await forecast.save();

        res.status(201).send({ message: 'Forecast data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error saving forecast data' });
    }
});

router.get('/city/:city', async(req, res) => {
    const city = req.params.city;
    let lang = req.query.lang || 'en';
    try {
        let responce = await axios.get(`https://api.api-ninjas.com/v1/city?name=${city}&lang=${lang}`, {
            headers: {
                'X-Api-Key': NINJAS_CITY_API
            },
            contentType: 'routerlication/json'
        });
        if(responce.status == '200') {
            res.json(responce.data[0]);
        }
        
    } catch(e) {
        console.error(e.message);
        res.status(500).send('Error fetching city data');
    }
});  

router.get('/openweather/:city', async (req, res) => {
    const city = req.params.city;
    let lang = req.query.lang || 'en';
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API}&units=metric&lang=${lang}`);
    //   console.log(response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching OpenWeather data:", error);
      res.status(500).json({ error: error.message });
    }
});


router.get('/weatherbit/:city', async (req, res) => {
    const city = req.params.city;
    let lang = req.query.lang || 'en';
    try {
      const response = await axios.get(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${WEATHERBIT_API}&lang=${lang}`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Weatherbit data:", error);
      res.status(500).json({ error: error.message });
    }
});

router.get('/weatherbit/forecast/:city', async (req, res) => {
    const city = req.params.city;
    let lang = req.query.lang || 'en';
    try {
        const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHERBIT_API}&days=16&lang=${lang}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Weatherbit forecast data:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;