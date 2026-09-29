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
        const res = await client.query('SELECT * FROM products');
        console.log(res.rows);

    } catch (err) {
        console.error('Error printing products:', err);
    } finally {
        client.release();
    }
}

printSumProducts();

// async function add_cart_for_admin(){
//     const client = await pool.connect();
//     try{
//         const admin = await client.query(`
//             SELECT u.id
//             FROM users u
//             JOIN roles r ON r.id = u.role_id
//             WHERE r.name = $1
//             ORDER BY u.created_at
//             LIMIT 1`, ['Admin']);
//         if (!admin.rows[0]) {
//             console.log('No Admin user found; skipping admin cart seed');
//             return;
//         }

//         const adminUserId = admin.rows[0].id;
//         const inserted_cart = await client.query(
//             'INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING RETURNING id',
//             [adminUserId]
//         );
//         const cart = inserted_cart.rows[0] || (await client.query(
//             'SELECT id FROM carts WHERE user_id = $1', [adminUserId]
//         )).rows[0];
//         const cart_id = cart.id;

//         const product_id = await client.query('SELECT id FROM products LIMIT 1');
//         if (!product_id.rows[0]) {
//             console.log('Admin cart is ready; no products found to seed');
//             return;
//         }

//         const productId = product_id.rows[0].id;
//         const item = await client.query(`
//             INSERT INTO cart_items (cart_id, product_id, quantity)
//             SELECT $1, $2, $3
//             WHERE NOT EXISTS (
//                 SELECT 1 FROM cart_items WHERE cart_id = $1 AND product_id = $2
//             )
//             RETURNING id`, [cart_id, productId, 1]);
//         console.log(item.rowCount ? 'Product added to Admin cart' : 'Admin cart already contains the seed product');
//     } catch (err) {
//         console.error('Error adding cart for Admin user:', err);
//     } finally {
//         client.release();
//     }
// }
// add_cart_for_admin();