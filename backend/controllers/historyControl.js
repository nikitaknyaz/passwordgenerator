const { getHistory, clearHistory } = require('../main_funcs/storageFuncs');//подключаем функцию

function get(req, res) { //получение истории
    const history = getHistory();
    res.json(history);
}

function clear(req, res) { // очистка истории
    clearHistory();
    res.json({ message: 'История очищена' });
}

module.exports = { get, clear }; // для роутера