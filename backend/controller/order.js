const {
    create_order_service,
    get_user_orders_service
} = require('../service/order')

async function create_order_controller(req, res) {
    const user_id = req.user.id;
    const { items,phone, city, location, address_notes} = req.body;
    const order = await create_order_service(items, user_id, phone, city, location, address_notes);
    return res.status(201).json(order);
}

async function get_user_orders_controller(req, res) {
    const user_id = req.user.id;
    const orders = await get_user_orders_service(user_id);
    return res.status(200).json(orders);
}

module.exports = {
    create_order_controller,
    get_user_orders_controller
}