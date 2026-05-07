// подключение sqlite3 для работы с базой данных
const sqlite3 = require('sqlite3').verbose();
// подключение path для правильного формирования пути к файлу бд
const path = require('path');

// путь к файлу базы данных (находится в папке backend)
const dbPath = path.join(__dirname, '../passwords.db');
// создание подключения к базе данных
const db = new sqlite3.Database(dbPath);

// создание таблицы passwords с полями согласно требованию к бд
// список полей: encrypted_password, password1_is_1_hash, length,
// has_uppercase, has_lowercase, has_digits, has_symbols,
// generated_at, strength_score
db.run(`
    create table if not exists passwords (
        id integer primary key autoincrement,
        password text not null,
        length integer not null,
        has_uppercase integer not null,
        has_lowercase integer not null,
        has_digits integer not null,
        has_symbols integer not null,
        generated_at text not null,
        strength_score integer not null
    )
`);

// функция добавления нового пароля в базу данных
// принимает: сам пароль, длину, наличие каждого типа символов, оценку силы
function addPassword(plainPassword, length, hasUppercase, hasLowercase, hasDigits, hasSymbols, strengthScore) {
    // возвращаем promise для удобства использования async/await
    return new Promise((resolve, reject) => {
        db.run(
            `insert into passwords (
                password,
                length,
                has_uppercase,
                has_lowercase,
                has_digits,
                has_symbols,
                generated_at,
                strength_score
            ) values (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                plainPassword,
                length,
                hasUppercase ? 1 : 0,
                hasLowercase ? 1 : 0,
                hasDigits ? 1 : 0,
                hasSymbols ? 1 : 0,
                new Date().toISOString(),
                strengthScore
            ],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

// функция получения последних 10 паролей из истории
// требование кейса: хранение истории генераций
function getLastPasswords() {
    return new Promise((resolve, reject) => {
        db.all(
            `select 
                password,
                length,
                has_uppercase,
                has_lowercase,
                has_digits,
                has_symbols,
                generated_at,
                strength_score
            from passwords 
            order by id desc limit 10`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
}

// функция очистки всей истории
function clearHistory() {
    return new Promise((resolve, reject) => {
        db.run('delete from passwords', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// экспорт функций для использования в других файлах
module.exports = { addPassword, getLastPasswords, clearHistory };