const {AppError} = require('../middleware/handler.js')
const {transaction} = require('../utils/transactions.js')
const {is_product,get_product_quantity,get_product_price,reduce_product_quantity} = require('../repository/products/products.js')

const {create_order,add_order_items,get_order_status_id,get_user_orders
    } = require('../repository/order')


async function create_order_service(items, user_id, phone, city, location = null, address_notes = null) {
    return transaction(async (client) => {
        let total_price = 0;
        for (const item of items) {
            const productExists = await is_product(item.product_id);
            if (!productExists) {
                throw new AppError('One or more products do not exist', 400);
            }
            const availableQuantity = await get_product_quantity(item.product_id);
            if (availableQuantity < item.quantity) {
                throw new AppError(`Insufficient quantity for product ID ${item.product_id}`, 400);
            }
            const unitPrice = await get_product_price(client, item.product_id);
            item.unit_price = unitPrice;
            item.subtotal = unitPrice * item.quantity;
            total_price += item.subtotal;
        }
        const status_id = await get_order_status_id(client, 'Pending');
        const order = await create_order(client, user_id, total_price, status_id, phone, city, location, address_notes);
        for (const item of items) {
            await add_order_items(client, order.id, [item]);
            await reduce_product_quantity(client, item.product_id, item.quantity);
        }
        return order;
    })
}

async function get_user_orders_service(user_id) {
    return transaction(async (client) => {
        const orders = await get_user_orders(client, user_id);
        return orders;
    })
}
gjk

module.exports = {
    create_order_service,
    get_user_orders_service
}