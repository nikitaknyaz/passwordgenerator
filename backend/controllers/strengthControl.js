// контроллер для проверки силы пароля

const { checkStrength } = require('../main_funcs/generatePass');

function check(req, res) {
    // извлечение пароля из тела запроса
    const { password } = req.body;
    // вызов функции проверки силы
    const result = checkStrength(password);
    // отправка результата
    res.json(result);
}

module.exports = { check };