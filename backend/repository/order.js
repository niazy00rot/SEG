const {pool} = require("../database/db.js")

async function get_order_status_id(client,name) {
    const result = await client.query(`SELECT id FROM order_statuses WHERE name = $1`, [name]);
    return result.rows[0].id || null;
}
async function create_order(client, user_id,  total_price, status_id, phone, city, location = null, address_notes = null) {
    const order_id = await client.query(
        `INSERT INTO orders 
        (user_id, total_price, order_status_id, phone, city, location, address_notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * `,
        [user_id, total_price, status_id, phone, city, location, address_notes]
    );
    return order_id.rows[0]
}

async function add_order_items(client, order_id, data) {
    for (const item of data) {
        await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
            VALUES ($1, $2, $3, $4, $5)`,
            [order_id, item.product_id, item.quantity, item.unit_price, item.subtotal]
        );
    }
    return true;
}

async function get_user_orders(client, user_id) {
    const result = await client.query(
        `SELECT o.id, o.order_number, o.total_price, o.location, o.address_notes, o.phone, o.city, os.name AS status, o.created_at
        FROM orders o
        JOIN order_statuses os ON o.order_status_id = os.id
         FROM orders o WHERE user_id = $1`,
    )
    return result.rows;
}

async function get_order_by_id(client,id) {
    
}
module.exports = {
    create_order,
    add_order_items,
    get_order_status_id,
    get_user_orders
}