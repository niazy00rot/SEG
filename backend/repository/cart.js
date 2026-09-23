const {pool} = require('../database/db')

async function get_cart_id_by_user_id(user_id) {
    const client = await pool.connect()
    try{
        const res = await client.query(`SELECT id FROM carts WHERE user_id = $1`,[user_id])
        return res.rows[0] || null
    }
    catch(err){
        console.error('Error fetching cart ID by user ID:', err)
        throw err
    }
    finally{
        await client.release()
    }
}

async function get_cart_items(cart_id) {
    const client = await pool.connect()
    try{
        const res = await client.query(
            `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1`,
            [cart_id]
        )
        return res.rows || []
    }
    catch(err){
        console.error('Error fetching cart item:', err)
        throw err
    }
    finally{
        await client.release()
    }
}

async function add_item_to_cart(cart_id, product_id, quantity) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
            [cart_id, product_id, quantity]
        )
        return res.rows[0]
    } 
    catch (err) {
        console.error('Error adding item to cart:', err)
        throw err
    } 
    finally {
        await client.release()
    }
}

async function remove_item_from_cart(cart_id, product_id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
            [cart_id, product_id]
        )
        return res.rows[0]
    } 
    catch (err) {
        console.error('Error removing item from cart:', err)
        throw err
    } 
    finally {
        await client.release()
    }
}

async function update_cart_item_quantity(cart_id, product_id, quantity) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
            [quantity, cart_id, product_id]
        )
        return res.rows[0]
    }
    catch (err) {
        console.error('Error updating cart item quantity:', err)
        throw err
    }
    finally {
        await client.release()
    }
}

async function clear_cart(cart_id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `DELETE FROM cart_items WHERE cart_id = $1 RETURNING *`,
            [cart_id]
        )
        return res.rows
    }
    catch (err) {
        console.error('Error clearing cart:', err)
        throw err
    }
    finally {
        await client.release()
    }
}

async function get_cart_total(cart_id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `SELECT SUM(ci.quantity * p.price) as total
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1`,
            [cart_id]
        )
        return res.rows[0].total || 0
    } catch (err) {
        console.error('Error fetching cart total:', err)
        throw err
    } finally {
        await client.release()
    }
}

async function add_cart(user_id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
            [user_id]
        )
        return res.rows[0]
    } catch (err) {
        console.error('Error adding cart:', err)
        throw err
    } finally {
        await client.release()
    }
}


module.exports = {
    get_cart_id_by_user_id,
    get_cart_items,
    add_item_to_cart,
    remove_item_from_cart,
    update_cart_item_quantity,
    clear_cart,
    get_cart_total,
    add_cart
}