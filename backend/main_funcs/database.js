const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'password_generator',
    password: 'qwebnm888',
    port: 5432,
});

async function initDatabase() {
    const createTableQuery = `
        create table if not exists passwords (
            id serial primary key,
            password text not null,
            length integer not null,
            has_uppercase integer not null,
            has_lowercase integer not null,
            has_digits integer not null,
            has_symbols integer not null,
            generated_at timestamp not null,
            strength_score integer not null
        )
    `;
    await pool.query(createTableQuery);
    console.log('таблица passwords создана или уже существует');
}

async function addPassword(password, length, hasUppercase, hasLowercase, hasDigits, hasSymbols, strengthScore) {
    // преобразуем булевы значения в числа 0/1
    const up = hasUppercase ? 1 : 0;
    const low = hasLowercase ? 1 : 0;
    const dig = hasDigits ? 1 : 0;
    const sym = hasSymbols ? 1 : 0;

    const query = `
        insert into passwords (
            password, length, has_uppercase, has_lowercase,
            has_digits, has_symbols, generated_at, strength_score
        ) values ($1, $2, $3, $4, $5, $6, $7, $8)
        returning id
    `;
    const values = [password, length, up, low, dig, sym, new Date(), strengthScore];
    const result = await pool.query(query, values);
    return result.rows[0].id;
}

async function getLastPasswords() {
    const query = `
        select password, length, has_uppercase, has_lowercase,
               has_digits, has_symbols, generated_at, strength_score
        from passwords order by id desc limit 10
    `;
    const result = await pool.query(query);
    return result.rows;
}

async function clearHistory() {
    await pool.query('delete from passwords');
}

initDatabase().catch(err => console.error('ошибка инициализации бд:', err));

module.exports = { addPassword, getLastPasswords, clearHistory };