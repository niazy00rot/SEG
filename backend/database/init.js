const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const bcrypt = require('bcrypt');

async function initDB() {
    let client;

    try {
        client = await pool.connect();

        const sql = fs.readFileSync(
            path.join(__dirname, 'init.sql'),
            'utf8'
        );

        // Create tables and default data
        await client.query(sql);

        console.log('Database initialized successfully');

    } catch (err) {
        console.error('Error initializing the database:', err);
        process.exitCode = 1;

    } finally {
        if (client) {
            client.release();
        }
    }
}

initDB();