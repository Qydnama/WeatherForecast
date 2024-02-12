# Weather Website using Node.js

## Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the server with `node app.js`.
4. Access the website at [http://localhost:3000](http://localhost:3000).

## Overview

This project is a Weather output website developed using Node.js. The application allows users to check the weather on the given city and many more information. The project includes server-side logic for Weather API's, City API's.

## API Services

API services that were used:

- **openweathermap:** For current weather status.
- **weatherbit:** For 14 days weather forecast.
- **ninjacity:** For city information.
- **openstreetmap:** For map of the city using lat and long.

## File Structure

The project has the following folder structure:

- **public:** Contains static files (CSS, images, etc.).
- **views:** HTML templates for rendering pages.

## Route Structure

- **/:** Main page that handles GET request were you need to choose a city.

## Express Server (app.js)

Express.js is used for handling the server, running on port 3000 (`const port = 3000;`).

## Integration of NPM Packages

Seven npm packages related to the project topic are integrated into the root JavaScript file: 
- **axios**
- **dotenv**
- **ejs**
- **express**
- **nodemon**
- **path**
- **morgan**



