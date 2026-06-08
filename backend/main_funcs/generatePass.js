const crypto = require('crypto');

function generatePassword(length, options) {
    const { useUpper, useLower, useDigits, useSpecial, excludeAmbiguous } = options;

    // наборы символов
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let digits = '0123456789';
    let special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // исключаем неоднозначные символы если нужно
    if (excludeAmbiguous) {
        upper = upper.replace(/[IO]/g, '');
        lower = lower.replace(/[il]/g, '');
        digits = digits.replace(/[01]/g, '');
    }

    // собираем пул разрешённых символов
    let allowedChars = '';
    if (useUpper) allowedChars += upper;
    if (useLower) allowedChars += lower;
    if (useDigits) allowedChars += digits;
    if (useSpecial) allowedChars += special;

    // проверяем, что выбран хоть один тип символов
    if (allowedChars.length === 0) {
        return null;
    }

    // гарантированный набор: по одному символу из каждого выбранного типа
    let guaranteedChars = '';
    if (useUpper) {
        const bytes = crypto.randomBytes(1);
        guaranteedChars += upper[bytes[0] % upper.length];
    }
    if (useLower) {
        const bytes = crypto.randomBytes(1);
        guaranteedChars += lower[bytes[0] % lower.length];
    }
    if (useDigits) {
        const bytes = crypto.randomBytes(1);
        guaranteedChars += digits[bytes[0] % digits.length];
    }
    if (useSpecial) {
        const bytes = crypto.randomBytes(1);
        guaranteedChars += special[bytes[0] % special.length];
    }

    // остаток длины, который нужно заполнить случайными символами
    const remainingLength = length - guaranteedChars.length;
    
    // заполняем остаток случайными символами из общего пула
    let randomPart = '';
    const randomBytes = crypto.randomBytes(remainingLength);
    for (let i = 0; i < remainingLength; i++) {
        randomPart += allowedChars[randomBytes[i] % allowedChars.length];
    }

    // объединяем гарантированную часть и случайную
    let password = guaranteedChars + randomPart;

    // перемешиваем пароль, чтобы гарантированные символы не стояли в начале
    const shuffleBytes = crypto.randomBytes(password.length);
    const passwordArray = password.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = shuffleBytes[i] % (i + 1);
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    password = passwordArray.join('');

    return password;
}

function checkStrength(password) {
    let score = 0;

    if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 8) {
        score += 1;
    }

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;

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