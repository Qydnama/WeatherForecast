const express = require('express');
const app = express();
const path = require('path');
const { PORT, SECRET } = require('./config/general');

// для обработки .env файла
require('dotenv').config();

// Middleware для обработки ejs файлов
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware для обработки статических файлов
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));

// Подключение Middleware для логирования
const morgan = require('morgan');
app.use(morgan('tiny'));

// Middleware для анализа запросов с URL-encoded данными
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware для парсинга cookie
const session = require('express-session');
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Защита cookie от доступа через JavaScript на стороне клиента
        maxAge: 1000 * 60 * 60 // Время жизни cookie (в данном случае, 1 час)
      }
  }));

// Подключение Middleware для обработки языков
const languageHandler = require('./middleware/languageHandler');
app.use(languageHandler);

//mongo database connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI, { dbName: 'weatherWebsite' });
const db = mongoose.connection;
db.on('error',(error) => console.log(error));
db.once('open', () => console.log('Connected to the Database'));

// Подключение маршрутов
const mainRoutes = require('./routes/mainRoute');
const usersRoutes = require('./routes/userRoute');
const forecastsRoutes = require('./routes/forecastRoute');
app.use(mainRoutes);
app.use(`/user`, usersRoutes);
app.use(`/forecast`, forecastsRoutes);



// Middleware для обработки ошибок
const errorHandler = require('./middleware/errorHandler'); 
app.use(errorHandler);

// Listening with Port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

