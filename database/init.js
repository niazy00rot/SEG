const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function initDB() {
    try {
        const client = await pool.connect();
        const sql = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
        await client.query(sql);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing the database:', err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

initDB();