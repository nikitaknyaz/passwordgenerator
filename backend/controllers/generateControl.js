const { generatePassword } = require('../main_funcs/generatePass');
const { addToHistory } = require('../main_funcs/storageFuncs');

// функция-контроллер для обработки запроса на генерацию пароля
async function generate(req, res) {
    // извлечение параметров из тела запроса
    const { length, useUpper, useLower, useDigits, useSpecial, excludeAmbiguous } = req.body;

    // вызов функции генерации пароля
    const password = generatePassword(length, {
        useUpper,
        useLower,
        useDigits,
        useSpecial,
        excludeAmbiguous
    });

    // проверка ошибки: не выбран ни один тип символов
    if (!password) {
        return res.status(400).json({ error: 'выберите хотя бы один тип символов' });
    }

    // сохранение пароля в историю и получение обновлённого списка
    const history = await addToHistory(password, length, {
        useUpper,
        useLower,
        useDigits,
        useSpecial
    });

    // отправка ответа фронтенду
    res.json({ password, history });
}

module.exports = { generate };