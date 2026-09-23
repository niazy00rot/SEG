const {
    get_cart_items,
    add_item_to_cart_service,
    remove_item_from_cart_service,
    update_cart_item_quantity_service,
    clear_cart_service
} = require('../service/cart.js')

async function get_cart_items_controller(req, res) {
    const user_id = req.user.id
    const items = await get_cart_items(user_id)
    return res.status(200).json(items)
}

async function add_item_to_cart_controller(req, res) {
    const user_id = req.user.id
    const { product_id, quantity } = req.body
    const item = await add_item_to_cart_service(user_id, product_id, quantity)
    return res.status(201).json(item)
}

async function remove_item_from_cart_controller(req, res) {
    const user_id = req.user.id
    const { product_id } = req.params
    await remove_item_from_cart_service(user_id, product_id)
    return res.status(200).json({ message: "Item removed from cart" })
}

async function update_cart_item_quantity_controller(req, res) {
    const user_id = req.user.id
    const { product_id } = req.params
    const { quantity } = req.body
    const item = await update_cart_item_quantity_service(user_id, product_id, quantity)
    return res.status(200).json(item)
}

async function clear_cart_controller(req, res) {
    const user_id = req.user.id
    await clear_cart_service(user_id)
    return res.status(200).json({ message: "Cart cleared" })
}

module.exports = {
    get_cart_items_controller,
    add_item_to_cart_controller,
    remove_item_from_cart_controller,
    update_cart_item_quantity_controller,
    clear_cart_controller
}

