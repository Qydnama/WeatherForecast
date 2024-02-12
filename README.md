# Weather Website using Node.js and MongoDB

## Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the server with `npm start`.
4. Access the website at [http://localhost:3000](http://localhost:3000).

## Overview

This is a Weather Forecast website developed using Node.js and MongoDB. The application allows users to check the weather on the given city and many more information. The project includes server-side logic for Weather API's, City API's. It has graphs for 16 days forecast, PDF file for full user requests info and Admin Page. 
The Admin user is:
email: qydnama@gmail.com
password: 123 

## API Services

API services that were used:

- **openweathermap:** For current weather status.
- **weatherbit:** For 14 days weather forecast.
- **ninjacity:** For city information.
- **openstreetmap:** For map of the city using lat and long.

## File Structure

The project has the following folder structure:
- **config:** Stores config information.
- **middleware:** Has a middlewares that checks language, errors, etc.
- **models :** Here stores models of MongoDB schemas.
- **public:** Contains static files (CSS, images, etc.).
- **routers:** Routes for sertain endpoints. 
- **views:** HTML templates for rendering pages.


## Express Server (app.js)

Express.js is used for handling the server, running on port 3000 (`const port = 3000;`).

## Integration of NPM Packages

Twelve npm packages related to the project topic are integrated into the root JavaScript file: 
- **axios**
- **bcryptjs**
- **dotenv**
- **dotenv**
- **ejs**
- **express**
- **express-session**
- **fs**
- **mongoose**
- **morgan**
- **path**
- **pdfkit**



