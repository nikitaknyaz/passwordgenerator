const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'password_generator',
    password: 'qwebnm888',
    port: 5432,
});

async function runMigrations() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT NOW()
            );
        `);

        const { rows: applied } = await pool.query('SELECT name FROM migrations');
        const appliedNames = new Set(applied.map(row => row.name));

        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.up.sql'))
            .sort();

        for (const file of files) {
            if (!appliedNames.has(file)) {
                console.log(`Applying migration: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await pool.query(sql);
                await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                console.log(`Migration ${file} applied`);
            } else {
                console.log(`Skipping ${file} (already applied)`);
            }
        }

        console.log('All migrations applied successfully');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await pool.end();
    }
}

runMigrations();