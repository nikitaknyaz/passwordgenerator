const { generatePassword } = require('../main_funcs/generatePass.js'); // функция из сервиса
const { addToHistory } = require('../main_funcs/storageFuncs'); 

function generate(req, res) { // обработка запроса
    const { length, useUpper, useLower, useDigits, useSpecial, excludeAmbiguous } = req.body;

    const password = generatePassword(length, { // Достаём параметры из тела запроса
        useUpper,
        useLower,
        useDigits,
        useSpecial,
        excludeAmbiguous
    });

    if (!password) { // ошибка: без чекбоксов
        return res.status(400).json({ error: 'Выберите хотя бы один тип символов' });
    }

    const history = addToHistory(password, length); // сохранение 
    res.json({ password, history }); // отправляем пароль json`ом
}

module.exports = { generate }; // для использования в роутере