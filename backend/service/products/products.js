const { AppError } = require('../../middleware/handler.js')
const {is_category}= require('../../repository/products/categories.js')
const {is_product_type}= require('../../repository/products/product_types.js')
const {is_sku, is_product, create_product_db, 
    update_product_db,is_sku_taken, get_products_db,
    delete_product_db, get_product_by_id_db, add_product_images} = require('../../repository/products/products.js')

const {upload_image} = require('../cloudinar.js')

async function create_product(user_id, data, images) {
    const check_category = await is_category(data.category_id);
    if (!check_category) {
        throw new AppError("category not exist", 404);
    }
    const check_product_type = await is_product_type(data.product_type_id);
    if (!check_product_type) {
        throw new AppError("product_type not exist", 404);
    }
    const check_sku = await is_sku(data.sku);
    if (check_sku) {
        throw new AppError("sku already exist", 409);
    }
    if (images.length > 0) {
        if (
            !Number.isInteger(data.primary_image_index) ||
            data.primary_image_index < 0 ||
            data.primary_image_index >= images.length
        ) {
            throw new AppError("primary_image_index must point to one of the uploaded images",400);
        }
    }
    const product = await create_product_db(data, user_id);
    const product_id = product.id;
    for (let index = 0; index < images.length; index++) {
        const image = images[index];
        const upload_result = await upload_image(image);
        await add_product_images(
            product_id,
            upload_result.secure_url,
            index === data.primary_image_index,
            index
        );
    }
    return product;
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
    const result = await delete_product_db(pro_id, user_id)
    if (!result) {
        throw new AppError("Product not found", 404)
    }
    return result
}

async function get_product_by_id(pro_id){
    const res = await get_product_by_id_db(pro_id)
    if (!res) {
        throw new AppError("Product not found", 404)
    }
    const images = await get_product_images(pro_id)
    res.images = images
    return res
}

async function get_products(offset = 0,limit = 15){
    const res = await get_products_db(offset, limit)
    if (!res || res.length === 0) {
        throw new AppError("No products found", 404)
    }
    return res
}

module.exports = {
    create_product,
    update_product,
    delete_product,
    get_product_by_id,
    get_products
}