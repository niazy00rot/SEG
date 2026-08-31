const router = require('express').Router()

const {async_handler} = require('../../middleware/handler.js')
const {authorize_roles,authenticate} = require('../../middleware/auth.js')

const {get_product_types,get_type_by_id,add_type,update_type} = require("../../service/products/product_types.js");

router.get('/product_types', async_handler(async(req,res)=>{
    const result = await get_product_types();
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}))

router.get('/product_types/:id', async_handler(async(req,res)=>{
    const { id } = req.params;
    const result = await get_type_by_id(id);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}))

router.post('/product_types', authenticate, authorize_roles("Admin", "Employee"), async_handler(async(req,res)=>{
    const { name } = req.body;
    const result = await add_type(name);
    if (result.error) {
        return res.status(409).json(result);
    }
    return res.status(201).json(result);
}))

router.patch('/product_types/:id', authenticate, authorize_roles("Admin", "Employee"), async_handler(async(req,res)=>{
    const { id } = req.params;
    const { name } = req.body;
    const result = await update_type(id, name);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}))


// router.delete('/product_types/:id', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{

// }))

module.exports = router