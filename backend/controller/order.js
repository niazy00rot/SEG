const {
    create_order_service,
    get_user_orders_service,
    get_orders_by_id_service,
    cancel_order_service,
    get_all_orders_service,
    get_orders_by_id_admin_service,
    update_order_status_service
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
async function get_orders_by_id_controller(req, res) {
    const user_id = req.user.id;
    const {id} = req.params;
    const orders = await get_orders_by_id_service(id, user_id);
    return res.status(200).json(orders);
}

async function cancel_order_controller(req, res) {
    const user_id = req.user.id;
    const {id} = req.params;
    const order = await cancel_order_service(id, user_id);
    return res.status(200).json({ message: 'Order cancelled successfully', order });
}

// For Admin and Staff
async function get_all_orders_controller(req, res) {
    // there is a filter on the status
    const { status, limit = 10, offset = 0 } = req.query;
    const orders = await get_all_orders_service(status, limit, offset);
    return res.status(200).json(orders);    
}

async function get_orders_by_id_admin_controller(req, res) {
    const { id } = req.params;
    const order = await get_orders_by_id_admin_service(id);
    return res.status(200).json(order);
}

async function update_order_status_controller(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await update_order_status_service(id, status);
    return res.status(200).json({ message: 'Order status updated successfully', updatedOrder });
}


module.exports = {
    create_order_controller,
    get_user_orders_controller,
    get_orders_by_id_controller,
    cancel_order_controller,
    get_all_orders_controller,
    get_orders_by_id_admin_controller,
    update_order_status_controller
}