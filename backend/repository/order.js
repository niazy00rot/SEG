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
         FROM orders o WHERE user_id = $1`,[user_id]
    )
    return result.rows;
}

async function get_order_by_id(client,id,user_id) {
    const res = await client.query(
        `SELECT o.id, o.order_number, o.total_price, o.location, o.address_notes, o.phone, o.city, os.name AS status, o.created_at,
        oi.quantity, oi.unit_price, oi.subtotal, p.name
        FROM orders o
        JOIN order_statuses os ON o.order_status_id = os.id
        WHERE o.user_id = $1 and o.id = $2`,
        [user_id,id]
    )
    return res.rows[0]
}

async function get_order_items(client, id) {
    const res = await client.query(
        `SELECT oi.quantity, oi.unit_price, oi.subtotal, p.name
        FROM order_items oi
        JOIN products p os ON oi.product_id = p.id
        WHERE oi.order_id = $1`,
        [id])
    return res.rows
}

async function cancel_order(client, id, user_id) {
    const res = await client.query(`
        UPDATE orders
        SET order_status_id = (SELECT id FROM order_statuses WHERE name = 'Cancelled')
        WHERE id = $1 AND user_id = $2
        RETURNING id,order_number`,
        [id, user_id]
    );
    return res.rows[0];
}

// For Admin and Staff 

async function get_all_orders(client, status,limit = 10, offset = 0) {
    let query = `SELECT o.id, o.order_number, o.total_price, o.location, o.address_notes, o.phone, o.city, os.name AS status, o.created_at
    FROM orders o
    JOIN order_statuses os ON o.order_status_id = os.id`;
    if (status) {
        query += ` WHERE os.name = $1`;
    }
    query += ` ORDER BY o.created_at DESC LIMIT $2 OFFSET $3`;
    const params = status ? [status, limit, offset] : [limit, offset];
    const result = await client.query(query, params);
    return result.rows;
}

async function get_order_by_id_admin(client, id) {
    const res = await client.query(
        `SELECT o.id, o.order_number, o.total_price, o.location, o.address_notes, o.phone, o.city, os.name AS status, o.created_at
        FROM orders o
        JOIN order_statuses os ON o.order_status_id = os.id
        WHERE o.id = $1`,
        [id]
    );
    return res.rows[0];
}

async function update_order_status(client, id, status_id) {
    const res = await client.query(`
        UPDATE orders
        SET order_status_id = $1
        WHERE id = $2
        RETURNING id, order_number`,
        [status_id, id]
    );
    return res.rows[0];
}

module.exports = {
    create_order,
    add_order_items,
    get_order_status_id,
    get_user_orders,
    get_order_by_id,
    get_order_items,
    cancel_order,
    get_order_by_id_admin,
    update_order_status
}