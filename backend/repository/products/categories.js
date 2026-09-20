const { pool } = require('../../database/db.js');

async function get_categories() {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id, name
             FROM categories
             ORDER BY name ASC`
        );
        return res.rows;
    }
    catch (err) {
        console.error('Error repo get categories:', err);
        throw err;
    }
    finally {
        client.release();
    }
}

async function get_category_by_id(id) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id, name
             FROM categories
             WHERE id = $1`,
            [id]
        );
        return res.rows[0] || null;
    }
    catch (err) {
        console.error('Error repo get category:', err);
        throw err;
    }
    finally {
        client.release();
    }
}

async function add_category(name) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `INSERT INTO categories (name)
             VALUES ($1)
             RETURNING id, name`,
            [name]
        );
        return res.rows[0];
    }
    catch (err) {
        console.error('Error repo add category:', err);
        throw err;
    }
    finally {
        client.release();
    }
}

async function update_category(id, name) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `UPDATE categories
             SET name = $1
             WHERE id = $2
             RETURNING id, name`,
            [name, id]
        );
        return res.rows[0] || null;
    }
    catch (err) {
        console.error('Error repo update category:', err);
        throw err;
    }
    finally {
        client.release();
    }
}

async function delete_category(id) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `DELETE FROM categories
             WHERE id = $1
             RETURNING id, name`,
            [id]
        );
        return res.rows[0] || null;
    }
    catch (err) {
        console.error('Error repo delete category:', err);
        throw err;
    }
    finally {
        client.release();
    }
}

async function is_category(id) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            `SELECT id
             FROM categories
             WHERE id = $1`,
            [id]
        );
        return res.rows.length > 0;
    }
    catch (err) {
        console.error('Error repo check category:', err);
        throw err;
    }
    finally {
        client.release();
    }
}

module.exports = {

    get_categories,
    get_category_by_id,
    add_category,
    update_category,
    delete_category,
    is_category

};