const express = require('express');
const cors = require('cors');
const path = require('path');

const generateRoute = require('./apiEndpoints/generateRoute');
const historyRoute = require('./apiEndpoints/historyRoute');
const strengthRoute = require('./apiEndpoints/strengthRoute');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', generateRoute);
app.use('/api', historyRoute);
app.use('/api', strengthRoute);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/indexexp.html'));
});

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
});