const router = require('express').Router()

const {async_handler} = require('../middleware/handler.js')
const {authorize_roles,authenticate} = require('../middleware/auth.js')

const {get_categories,get_category_by_id,add_category,update_category} = require("../service/categories.js");

router.get('/categories', async_handler(async(req,res)=>{
    const result = await get_categories();
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}))

router.get('/categories/:id', async_handler(async(req,res)=>{
    const { id } = req.params;
    const result = await get_category_by_id(id);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}))

router.post('/categories', authenticate, authorize_roles("Admin", "Employee"), async_handler(async(req,res)=>{
    const { name } = req.body;
    const result = await add_category(name);
    if (result.error) {
        return res.status(409).json(result);
    }
    return res.status(201).json(result);
}))

router.patch('/categories/:id', authenticate, authorize_roles("Admin", "Employee"), async_handler(async(req,res)=>{
    const { id } = req.params;
    const { name } = req.body;
    const result = await update_category(id, name);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}))


// router.delete('/categories/:id', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{

// }))

module.exports = {router}