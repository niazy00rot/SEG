const {
    get_cart_id_by_user_id,
    get_cart_items: get_cart_items_repo,
    add_item_to_cart,
    remove_item_from_cart,
    update_cart_item_quantity,
    clear_cart,
    get_cart_total,
    add_cart
} = require('../repository/cart.js')
const {is_product,get_product_quantity} = require('../repository/products/products.js')

const { AppError } = require('../middleware/handler.js')

async function get_cart_items(user_id) {
    const cart_id = await get_cart_id_by_user_id(user_id)
    if (!cart_id) {
        const new_cart = await add_cart(user_id)
        return []
    }
    const items = await get_cart_items_repo(cart_id)
    return items
}

async function add_item_to_cart_service(user_id, product_id, quantity) {
    const product_exists = await is_product(product_id)
    if (!product_exists) {
        throw new AppError("Product not found", 404)
    }
    const available_quantity = await get_product_quantity(product_id)
    if (available_quantity < quantity) {
        throw new AppError("Insufficient product quantity", 400)
    }

    const cart_id = await get_cart_id_by_user_id(user_id)
    if (!cart_id) {
        const new_cart = await add_cart(user_id)
        return await add_item_to_cart(new_cart, product_id, quantity)
    }
    return await add_item_to_cart(cart_id, product_id, quantity)
}

async function remove_item_from_cart_service(user_id, product_id) {
    const cart_id = await get_cart_id_by_user_id(user_id)
    if (!cart_id) {
        throw new AppError("Cart not found", 404)
    }
    return await remove_item_from_cart(cart_id, product_id)
}

async function update_cart_item_quantity_service(user_id, product_id, quantity) {
    const product_exists = await is_product(product_id)
    if (!product_exists) {
        throw new AppError("Product not found", 404)
    }
    const cart_id = await get_cart_id_by_user_id(user_id)
    if (!cart_id) {
        throw new AppError("Cart not found", 404)
    }
    return await update_cart_item_quantity(cart_id, product_id, quantity)
}

async function clear_cart_service(user_id) {
    const cart_id = await get_cart_id_by_user_id(user_id)
    if (!cart_id) {
        throw new AppError("Cart not found", 404)
    }
    return await clear_cart(cart_id)
}

module.exports = {
    get_cart_items,
    add_item_to_cart_service,
    remove_item_from_cart_service,
    update_cart_item_quantity_service,
    clear_cart_service
}