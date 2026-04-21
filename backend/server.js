const express = require('express');
const cors = require('cors');

const generateRoute = require('./apiEndpoints/generateRoute');
const historyRoute = require('./apiEndpoints/historyRoute');
const strengthRoute = require('./apiEndpoints/strengthRoute');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', generateRoute);
app.use('/api', historyRoute);
app.use('/api', strengthRoute);

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});