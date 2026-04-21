const fs = require('fs');
const path = require('path');

const historyPath = path.join(__dirname, '../history.json');

function loadHistory() {
    if (!fs.existsSync(historyPath)) {
        return [];
    }
    const data = fs.readFileSync(historyPath, 'utf8');
    return JSON.parse(data);
}

function saveHistory(history) {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

function addToHistory(password, length) {
    const history = loadHistory();
    history.unshift({
        password: password,
        timestamp: new Date().toISOString(),
        length: length
    });
    if (history.length > 10) history.pop();
    saveHistory(history);
    return history;
}

function getHistory() {
    return loadHistory();
}

function clearHistory() {
    saveHistory([]);
}

module.exports = { addToHistory, getHistory, clearHistory };