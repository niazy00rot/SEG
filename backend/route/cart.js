const router = require('express').Router()
const {get_cart_items_controller, add_item_to_cart_controller, remove_item_from_cart_controller, update_cart_item_quantity_controller, clear_cart_controller} = require('../controller/cart.js')
const {authenticate} = require('../middleware/auth.js')
const {async_handler} = require('../middleware/handler.js')

router.get('/cart', authenticate, async_handler(get_cart_items_controller))
router.post('/cart', authenticate, async_handler(add_item_to_cart_controller))
router.delete('/cart/:product_id', authenticate, async_handler(remove_item_from_cart_controller))
router.patch('/cart/:product_id', authenticate, async_handler(update_cart_item_quantity_controller))
router.delete('/cart', authenticate, async_handler(clear_cart_controller))

module.exports = router