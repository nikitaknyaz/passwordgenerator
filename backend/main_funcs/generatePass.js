// подключение встроенного модуля crypto для криптостойкой генерации
const crypto = require('crypto');

// функция генерации пароля
// принимает длину и настройки (какие типы символов использовать)
function generatePassword(length, options) {
    const { useUpper, useLower, useDigits, useSpecial, excludeAmbiguous } = options;

    // наборы символов согласно требованию кейса:
    // прописные (a-z), строчные (a-z), цифры (0-9), спецсимволы (!@#$)
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let digits = '0123456789';
    let special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // требование кейса: исключение неоднозначных символов (0, O, l, I)
    if (excludeAmbiguous) {
        upper = upper.replace(/[IO]/g, '');
        lower = lower.replace(/[il]/g, '');
        digits = digits.replace(/[01]/g, '');
    }

    // сбор пула разрешённых символов на основе выбранных опций
    let allowedChars = '';
    if (useUpper) allowedChars += upper;
    if (useLower) allowedChars += lower;
    if (useDigits) allowedChars += digits;
    if (useSpecial) allowedChars += special;

    // проверка: выбран хотя бы один тип символов
    if (allowedChars.length === 0) {
        return null;
    }

    // генерация пароля с использованием криптостойкого генератора случайных чисел
    let password = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        password += allowedChars[bytes[i] % allowedChars.length];
    }

    return password;
}

// функция проверки силы пароля
// требование кейса: оценка надёжности (силы) сгенерированного пароля
function checkStrength(password) {
    let score = 0;

    // оценка длины пароля
    if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 8) {
        score += 1;
    }

    // оценка разнообразия символов
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;

    // определение уровня силы для визуального индикатора
    let strength = 'weak';
    let color = '#ff4444';

    if (score >= 6) {
        strength = 'strong';
        color = '#44ff44';
    } else if (score >= 4) {
        strength = 'medium';
        color = '#ffaa44';
    }

    return { strength, color, score };
}

module.exports = { generatePassword, checkStrength };