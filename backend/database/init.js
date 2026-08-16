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

        // Hash admin password
        const hashedPassword = await bcrypt.hash('adminpassword', 10);

        // Get Admin role
        const roleResult = await client.query(
            'SELECT id FROM roles WHERE name = $1',
            ['Admin']
        );

        const adminRoleId = roleResult.rows[0].id;

        // Create admin
        await client.query(
            `INSERT INTO users (role_id, name, email, password)
             VALUES ($1, $2, $3, $4)`,
            [
                adminRoleId,
                'Admin',
                'admin@seg.com',
                hashedPassword
            ]
        );

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