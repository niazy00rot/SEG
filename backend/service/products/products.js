const {pool} = require('../../database/db.js')
const { AppError } = require('../../middleware/handler.js')
const {is_category}= require('./categories.js')
const {is_product_type}= require('./product_types.js')

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

 async function add_product(category_id, type_id, user_id, name, description, sku, price, quantity){
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

async function create_product(category_id,product_type_id,user_id,name,description,sku,price,quantity){

    const check_category = await is_category(category_id)
    if (!check_category) {
        throw new AppError("category not exist", 404)
    }
    const check_product_type = await is_product_type(product_type_id)
    if (!check_product_type) {
        throw new AppError("product_type not exist", 404)
    }
    const check_sku = await is_sku(sku)
    if (check_sku) {
        throw new AppError("sku already exist", 409)
    }
    return await add_product(category_id,product_type_id,user_id,name,description,sku,price,quantity
    )
}

module.exports = {
    add_product,
    is_sku,
    create_product
}