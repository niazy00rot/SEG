const router = require('express').Router();
const {async_handler} = require('../middleware/handler.js')
const {authorize_roles,authenticate} = require('../middleware/auth.js')
const {validate} = require('../validation/validate.js')
const {create_order_sc} = require('../validation/order.js')
const {
    create_order_controller,
    get_user_orders_controller
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

module.exports=router