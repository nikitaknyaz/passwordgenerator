// контроллер для работы с историей паролей

const { getHistory, clearHistory } = require('../main_funcs/storageFuncs');

// функция получения истории
async function get(req, res) {
    const history = await getHistory();
    res.json(history);
}

// функция очистки истории
async function clear(req, res) {
    const result = await clearHistory();
    res.json(result);
}

module.exports = { get, clear };