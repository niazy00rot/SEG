const { pool } = require('../../database/db.js')

async function get_type_by_category(category_id) {
    const client = await pool.connect()
    try {
        const res = await client.query('SELECT * FROM product_types WHERE category_id = $1',[category_id])
        return res.rows 
    }
    catch (err) {
        console.error('Error repo get product types by category:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function is_product_type(id) {
    const client = await pool.connect()
    try {
        const res = await client.query('SELECT id FROM product_types WHERE id = $1',[id])
        return res.rows.length > 0
    }
    catch (err) {
        console.error('Error check product_type:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function get_product_types() {
    const client = await pool.connect()
    try {
        const res = await client.query('SELECT * FROM product_types')
        return res.rows
    }
    catch (err) {
        console.error('Error get product_types:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function get_type_by_id(id) {
    const client = await pool.connect()
    try {
        const res = await client.query( 'SELECT * FROM product_types WHERE id = $1',[id])
        return res.rows[0] || null
    }
    catch (err) {
        console.error('Error get product_type:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function add_type(name, category_id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `INSERT INTO product_types
                (name, category_id)
             VALUES
                ($1, $2)
             RETURNING *`,
            [name, category_id]
        )
        return res.rows[0]
    }
    catch (err) {
        console.error('Error add product_type:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function update_type(id, name) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `UPDATE product_types
             SET name = $1
             WHERE id = $2
             RETURNING *`,
            [name, id]
        )
        return res.rows[0] || null
    }
    catch (err) {
        console.error('Error update product_type:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function delete_type(id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `DELETE FROM product_types
             WHERE id = $1
             RETURNING *`,
            [id]
        )
        return res.rows[0] || null
    }
    catch (err) {
        console.error('Error delete product_type:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function is_product_type_name(category_id, name) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `SELECT id
             FROM product_types
             WHERE category_id = $1
             AND name = $2`,
            [category_id, name]
        )
        return res.rows.length > 0
    }
    catch (err) {
        console.error('Error check product type name:',err)
        throw err
    }
    finally {
        client.release()
    }
}

async function is_product_type_name_except(category_id,name,id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `SELECT id
             FROM product_types
             WHERE category_id = $1
             AND name = $2
             AND id <> $3`,
            [category_id, name, id]
        )
        return res.rows.length > 0
    }
    catch (err) {
        console.error('Error check product type name except:',err)
        throw err
    }
    finally {
        client.release()
    }
}

module.exports = {
    get_type_by_category,
    get_product_types,
    get_type_by_id,
    add_type,
    update_type,
    delete_type,
    is_product_type,
    is_product_type_name,
    is_product_type_name_except
}
