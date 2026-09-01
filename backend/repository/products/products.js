const {pool} = require('../../database/db.js')

async function is_sku(sku) {
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT id FROM products WHERE sku = $1',[sku])
        return res.rows.length > 0
    }
    catch(err){
        console.error('Error ckeck sku:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function is_product(id){
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT id FROM products WHERE id = $1',[id])
        return res.rows.length > 0
    }
    catch(err){
        console.error('Error ckeck id:', err)
        throw err
    }
    finally{
        client.release()
    }
}

 async function create_product_db(category_id, type_id, user_id, name, description, sku, price, quantity){
    const client = await pool.connect()
    try{
        const res = await client.query('INSERT INTO products (category_id, product_type_id, created_by, name, description, sku, price, quantity) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[category_id, type_id, user_id, name, description, sku, price, quantity])
        return res.rows[0]
    }
    catch(err){
        console.error('Error add product:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function update_product_db(pro_id,user_id,category_id,product_type_id,name,description,sku,price,quantity){
    const client = await pool.connect()
    try{
        const res = await client.query(`UPDATE products SET
            category_id = COALESCE($1, category_id),
            product_type_id = COALESCE($2, product_type_id),
            name = COALESCE($3, name),
            description = COALESCE($4, description),
            sku = COALESCE($5, sku),
            price = COALESCE($6, price),
            quantity = COALESCE($7, quantity),
            updated_by = $8,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $9 RETURNING *`,[category_id,product_type_id,name,description,sku,price,quantity,user_id,pro_id])
        return res.rows[0]
    }
    catch(err){
        console.error(err)
        throw err
    }
    finally{
        client.release()
    }
}
async function is_sku_taken(sku, product_id) {
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT id FROM products WHERE sku = $1 AND id != $2',[sku, product_id])
        return res.rows.length > 0
    }
    catch(err){
        console.error('Error checking SKU:', err)
        throw err
    }
    finally{
        client.release()
    }
}

module.exports = {
    is_sku,
    is_product,
    create_product_db,
    update_product_db,
    is_sku_taken
}