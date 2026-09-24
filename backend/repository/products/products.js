const {pool} = require('../../database/db.js')

async function is_sku(sku) {
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT id FROM products WHERE sku = $1 AND deleted_at IS NULL',[sku])
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
        const res = await client.query(`SELECT id FROM products 
            WHERE id = $1 AND deleted_at IS NULL`,[id])
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

async function create_product_db(data, user_id){
    const client = await pool.connect()
    try{
        const res = await client.query(`
            INSERT INTO products 
            (category_id, product_type_id, created_by, name, description, sku, price, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, category_id, product_type_id, name, description, sku, price, quantity`, 
            [data.category_id, data.product_type_id, user_id, data.name, 
                data.description, data.sku, data.price, data.quantity])

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

async function add_product_images(product_id,image_path,is_primary,display_order){
    const client = await pool.connect();
    try {
        await client.query(`
            INSERT INTO product_images
                (product_id,image_path,is_primary,display_order)
            VALUES ($1, $2, $3, $4)`,[product_id,image_path,is_primary,display_order]
        );
    } 
    catch (err) {
        console.error("Error adding product image:", err);
        throw err;
    } 
    finally {
        client.release();
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
            WHERE id = $9 
            RETURNING id, category_id, product_type_id, name, description, sku, price, quantity`
            ,[category_id,product_type_id,name,description,sku,price,quantity,user_id,pro_id])
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
        const res = await client.query('SELECT id FROM products WHERE sku = $1 AND id != $2 AND deleted_at IS NULL',[sku, product_id])
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

async function delete_product_db(pro_id, user_id) {
    const client = await pool.connect()
    try {
        const res = await client.query(
            `UPDATE products
             SET deleted_at = CURRENT_TIMESTAMP,
             updated_by = $1,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             AND deleted_at IS NULL
             RETURNING id, category_id, product_type_id, name, description, sku, price, quantity`,
            [user_id, pro_id]
        )
        return res.rows[0]
    } finally {
        client.release()
    }
}

async function get_product_by_id_db(pro_id){
    const client = await pool.connect()
    try{
        const res =await client.query(`SELECT * FROM products 
            WHERE id = $1 AND deleted_at IS NULL`,[pro_id])
        return res.rows[0]
    }
    finally{
        client.release()
    }
}

async function get_products_db(offset = 0, limit = 15){
    const client = await pool.connect()
    try{
        const res =await client.query(`
            SELECT pi.image_url, p.id, p.category_id, p.product_type_id, 
            p.name, p.description, p.sku, p.price, p.quantity FROM products p
            JOIN product_images pi ON p.id = pi.product_id
            WHERE p.deleted_at IS NULL and pi.is_primary = true
            ORDER BY p.created_at DESC, p.id DESC LIMIT $2 OFFSET $1;`, [offset, limit])
        return res.rows
    }
    finally{
        client.release()
    }
}

async function get_product_images(pro_id){
    const client = await pool.connect()
    try{
        const res =await client.query(`SELECT image_url FROM product_images 
            WHERE product_id = $1`,[pro_id])
        return res.rows.map(row => row.image_url)
    }
    finally{
        client.release()
    }
}

async function get_product_quantity(pro_id){
    const client = await pool.connect()
    try{
        const res =await client.query(`SELECT quantity FROM products 
            WHERE id = $1 AND deleted_at IS NULL`,[pro_id])
        return res.rows[0]?.quantity || 0
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
    is_sku_taken,
    delete_product_db,
    get_product_by_id_db,
    get_products_db,
    get_product_quantity,
    add_product_images,
    get_product_images
}