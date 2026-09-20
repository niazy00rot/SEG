const router = require('express').Router()

const {async_handler} = require('../../middleware/handler.js')
const {authorize_roles,authenticate} = require('../../middleware/auth.js')
const {validate} = require('../../validation/validate.js')
const {product_id_sc,create_product_sc,update_product_sc} = require('../../validation/products/product.js')
const {get_products_controller,
    get_product_by_id_controller,
    create_product_controller,
    update_product_controller,
    delete_product_controller
} = require("../../controller/products/products.js")

router.get('/products/:id',
    validate(product_id_sc, 'params'),
    async_handler(get_product_by_id_controller))

router.get('/products',async_handler(get_products_controller))

router.post('/products', 
    authenticate, 
    authorize_roles("Admin", "Employee"),
    validate(create_product_sc),
    async_handler(create_product_controller))

router.patch('/products/:id', 
    authenticate, 
    authorize_roles("Admin", "Employee"),
    validate(product_id_sc, 'params'),
    validate(update_product_sc),
    async_handler(update_product_controller))

router.delete('/products/:id', 
    authenticate, 
    authorize_roles("Admin"),
    validate(product_id_sc, 'params'),
    async_handler(delete_product_controller)
)



module.exports=router