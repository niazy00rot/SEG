const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const bcrypt = require('bcrypt');

// async function initDB() {
//     let client;

//     try {
//         client = await pool.connect();

//         const sql = fs.readFileSync(
//             path.join(__dirname, 'init.sql'),
//             'utf8'
//         );
//         await client.query(sql);
//         console.log('Database initialized successfully');

//     } catch (err) {
//         console.error('Error initializing the database:', err);
//         process.exitCode = 1;

//     } finally {
//         if (client) {
//             client.release();
//         }
//     }
// 


// initDB();

// 


// print products 

async function printSumProducts(){
    const client = await pool.connect();    
    try{
        const res = await client.query('SELECT * FROM categories');
        console.log(res.rows);

    } catch (err) {
        console.error('Error printing products:', err);
    } finally {
        client.release();
    }
}

printSumProducts();