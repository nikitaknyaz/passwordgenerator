CREATE TABLE IF NOT EXISTS passwords (
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    length INTEGER NOT NULL,
    has_uppercase INTEGER NOT NULL,
    has_lowercase INTEGER NOT NULL,
    has_digits INTEGER NOT NULL,
    has_symbols INTEGER NOT NULL,
    generated_at TIMESTAMP NOT NULL,
    strength_score INTEGER NOT NULL
);