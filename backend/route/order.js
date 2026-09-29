const router = require('express').Router();
const {async_handler} = require('../middleware/handler.js')
const {authorize_roles,authenticate} = require('../middleware/auth.js')
const {validate} = require('../validation/validate.js')
const {create_order_sc,order_id_sc} = require('../validation/order.js')
const {
    create_order_controller,
    get_user_orders_controller,
    get_orders_by_id_controller,
    cancel_order_controller,
    get_all_orders_controller,
    get_orders_by_id_admin_controller,
    update_order_status_controller
} = require("../controller/order.js")

router.post('/orders',
    authenticate,
    validate(create_order_sc),
    async_handler(create_order_controller)
)

router.get('/orders',
    authenticate,
    async_handler(get_user_orders_controller)
)

router.get('/orders/:id',
    authenticate,
    validate(order_id_sc),
    async_handler(get_orders_by_id_controller)
)

router.delete('/orders/:id',
    authenticate,
    validate(order_id_sc),
    async_handler(cancel_order_controller)
)

router.get('/admin/orders',
    authenticate,
    authorize_roles('Admin','Employee'),
    async_handler(get_all_orders_controller)
)

router.get('/admin/orders/:id',
    authenticate,
    authorize_roles('Admin','Employee'),
    validate(order_id_sc),
    async_handler(get_orders_by_id_admin_controller)
)

router.put('/admin/orders/:id/status',
    authenticate,
    authorize_roles('Admin','Employee'),
    validate(order_id_sc),
    async_handler(update_order_status_controller)
)

module.exports=router