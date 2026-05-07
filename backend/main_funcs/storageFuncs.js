// подключение функций для работы с базой данных
const { addPassword, getLastPasswords, clearHistory } = require('./database');

// функция расчёта strength_score от 0 до 100 для хранения в бд
function calculateStrengthScore(length, hasUppercase, hasLowercase, hasDigits, hasSymbols) {
    let score = 0;

    // вклад длины (максимум 25 баллов)
    if (length >= 16) score += 25;
    else if (length >= 12) score += 20;
    else if (length >= 10) score += 15;
    else if (length >= 8) score += 10;
    else score += 5;

    // вклад типов символов
    if (hasUppercase) score += 15;
    if (hasLowercase) score += 15;
    if (hasDigits) score += 15;
    if (hasSymbols) score += 30;

    // ограничение максимум 100 баллов
    return Math.min(score, 100);
}

// добавление пароля в историю
// требование кейса: сохранение истории генераций
async function addToHistory(password, length, options) {
    const { useUpper, useLower, useDigits, useSpecial } = options;

    // преобразуем true/false в 1/0 явно
    const hasUppercase = useUpper ? 1 : 0;
    const hasLowercase = useLower ? 1 : 0;
    const hasDigits = useDigits ? 1 : 0;
    const hasSymbols = useSpecial ? 1 : 0;

    const strengthScore = calculateStrengthScore(
        length,
        hasUppercase === 1,
        hasLowercase === 1,
        hasDigits === 1,
        hasSymbols === 1
    );

    await addPassword(
        password,
        length,
        hasUppercase,    // теперь 0 или 1
        hasLowercase,    // теперь 0 или 1
        hasDigits,       // теперь 0 или 1
        hasSymbols,      // теперь 0 или 1
        strengthScore
    );

    return await getLastPasswords();
}

// получение всей истории из базы данных
async function getHistory() {
    return await getLastPasswords();
}

// очистка истории в базе данных
async function clearHistoryDb() {
    await clearHistory();
    return { message: 'история очищена' };
}

module.exports = { addToHistory, getHistory, clearHistory: clearHistoryDb, calculateStrengthScore };