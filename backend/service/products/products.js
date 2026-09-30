const { AppError } = require('../../middleware/handler.js')
const {is_category}= require('../../repository/products/categories.js')
const {is_product_type_for_category}= require('../../repository/products/product_types.js')
const {
    is_sku, 
    is_product, 
    create_product_db, 
    update_product_db,
    is_sku_taken, 
    get_products_db,
    get_product_images,
    delete_product_db, get_product_by_id_db, add_product_images} = require('../../repository/products/products.js')

const {upload_image} = require('../cloudinar.js')

async function create_product(user_id, data, images) {
    const check_category = await is_category(data.category_id);
    if (!check_category) {
        throw new AppError("category not exist", 404);
    }
    const check_product_type = await is_product_type_for_category(
        data.category_id,
        data.product_type_id
    );
    if (!check_product_type) {
        throw new AppError("product_type does not belong to category or does not exist", 400);
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
    const uploaded_images = [];
    for (let index = 0; index < images.length; index++) {
        const image = images[index];
        const upload_result = await upload_image(image);
        uploaded_images.push({
            image_path: upload_result.secure_url,
            is_primary: index === data.primary_image_index,
            display_order: index,
        });
    }

    const product = await create_product_db(data, user_id);
    for (const image of uploaded_images) {
        await add_product_images(
            product.id,
            image.image_path,
            image.is_primary,
            image.display_order
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
    for (const product of res) {
        const images = await get_product_images(product.id)
        product.images = images
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