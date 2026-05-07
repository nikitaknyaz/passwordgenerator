// подключение библиотеки express для создания веб-сервера
const express = require('express');
// подключение библиотеки cors для разрешения запросов с других доменов
const cors = require('cors');

// подключение роутеров (обработчиков разных url адресов)
const generateRoute = require('./apiEndpoints/generateRoute');
const historyRoute = require('./apiEndpoints/historyRoute');
const strengthRoute = require('./apiEndpoints/strengthRoute');

// создание приложения express
const app = express();
// назначение порта для сервера
const port = 3000;

// разрешаем запросы с любых доменов (чтобы фронтенд мог обращаться к бэкенду)
app.use(cors());
// позволяем серверу понимать json данные в теле запроса
app.use(express.json());

// подключение роутеров с префиксом /api
// все эндпоинты будут доступны по адресу http://localhost:3000/api/...
app.use('/api', generateRoute);
app.use('/api', historyRoute);
app.use('/api', strengthRoute);

// запуск сервера
app.listen(port, () => {
    console.log(`сервер запущен на http://localhost:${port}`);
});