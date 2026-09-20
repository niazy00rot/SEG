const router = require('express').Router();
const {authenticate,authorize_roles} =require('../../middleware/auth.js');
const {async_handler} = require('../../middleware/handler.js');
const { validate } = require('../../validation/validate.js'); 
const { create_category_schema, update_category_schema, category_id_schema } = require('../../validation/products/categories.js');
const {get_categories,get_category_by_id,add_category,update_category,delete_category} = require('../../controller/products/categories.js');

router.get('/categories',async_handler(get_categories));

router.get(
    '/categories/:id',
    validate(category_id_schema, 'params'),
    async_handler(get_category_by_id)
);

router.post(
    '/categories',
    authenticate,
    authorize_roles("Admin", "Employee"),
    validate(create_category_schema),
    async_handler(add_category)
);

router.patch(
    '/categories/:id',
    authenticate,
    authorize_roles("Admin", "Employee"),
    validate(category_id_schema, 'params'),
    validate(update_category_schema, 'body'),
    async_handler(update_category)
);

router.delete(
    '/categories/:id',
    authenticate,
    authorize_roles("Admin"),
    validate(category_id_schema, 'params'),
    async_handler(delete_category)
);

module.exports = router;