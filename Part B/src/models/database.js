const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Création des tables si elles n'existent pas
db.none(`
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        category TEXT,
        inStock BOOLEAN DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        userId TEXT NOT NULL,
        products JSONB NOT NULL,
        totalPrice NUMERIC NOT NULL,
        status TEXT DEFAULT 'Pending'
    );

    CREATE TABLE IF NOT EXISTS carts (
        userId TEXT PRIMARY KEY,
        items JSONB NOT NULL DEFAULT '[]',
        totalPrice NUMERIC DEFAULT 0
    );
`).then(() => console.log("Tables vérifiées"))
  .catch(err => console.error("Erreur de création des tables", err));

module.exports = db;
