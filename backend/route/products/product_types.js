const router = require('express').Router()

const {async_handler} = require('../../middleware/handler.js')
const { validate } = require('../../validation/validate.js'); 
const {authorize_roles,authenticate} = require('../../middleware/auth.js')
const {product_type_id_schema,
    category_id_schema,
    create_product_type_schema,
    update_product_type_schema
} = require('../../validation/products/product_types.js')
const {
    get_product_types,
    get_types_by_category,
    get_type_by_id,
    add_type,
    update_type,
    delete_type
} = require('../../controller/products/product_types.js')

router.get('/product_types', async_handler(get_product_types))

router.get('/categories/:category_id/product_types',
    validate(category_id_schema, 'params'),
    async_handler(get_types_by_category))

router.get('/product_types/:id', 
    validate(product_type_id_schema, 'params'), 
    async_handler(get_type_by_id))

router.post('/product_types', 
    authenticate, 
    authorize_roles("Admin", "Employee"), 
    validate(create_product_type_schema), 
    async_handler(add_type))

router.patch('/product_types/:id', 
    authenticate, 
    authorize_roles("Admin", "Employee"), 
    validate(product_type_id_schema, 'params'), 
    validate(update_product_type_schema, 'body'), 
    async_handler(update_type))

router.delete('/product_types/:id', 
    authenticate, 
    authorize_roles("Admin"), 
    validate(product_type_id_schema, 'params'), 
    async_handler(delete_type))

module.exports = router
