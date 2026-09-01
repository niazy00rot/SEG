const { AppError } = require('../../middleware/handler.js')
const {is_category}= require('./categories.js')
const {is_product_type}= require('./product_types.js')
const {is_sku, is_product, create_product_db, update_product_db, is_sku_taken,delete_product_db} = require('../../repository/products/products.js')


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
    return await create_product_db(category_id,product_type_id,user_id,name,description,sku,price,quantity
    )
}

async function update_product(pro_id, user_id, data){
    const {category_id,product_type_id,name,description,sku,price,quantity} = data
    if (!(await is_product(pro_id))) {
        throw new AppError("product not exist", 404)
    }
    if (category_id !== undefined) {
        const check_category = await is_category(category_id)
        if (!check_category) {
            throw new AppError("category not exist", 404)
        }
    }
    if (product_type_id !== undefined) {
        const check_product_type = await is_product_type(product_type_id)
        if (!check_product_type) {
            throw new AppError("product_type not exist", 404)
        }
    }
    if (sku !== undefined) {
        const check_sku = await is_sku_taken(sku, pro_id)
        if (check_sku) {
            throw new AppError("sku already exist", 409)
        }
    }   
    return await update_product_db(pro_id,user_id,category_id,product_type_id,name,description,sku,price,quantity)
}

async function delete_product(pro_id,user_id){
    const product_exist = await is_product(pro_id)
    if(!product_exist){
        throw new AppError("Product not found", 404)
    }
    const result = await delete_product_db(pro_id, user_id)
    return result
}

module.exports = {
    create_product,
    update_product
}