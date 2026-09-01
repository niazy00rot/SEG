const router = require('express').Router()

const {async_handler} = require('../../middleware/handler.js')
const {authorize_roles,authenticate} = require('../../middleware/auth.js')
const {validate} = require('../../middleware/validation/validate.js')
const {create_product_sc,update_product_sc} = require('../../middleware/validation/product.js')
const {create_product,update_product_sc} = require("../../service/products/products.js");

router.post('/products', 
    authenticate, 
    authorize_roles("Admin", "Employee"),
    validate(create_product_sc),
    async_handler(async(req,res)=>{
        const {category_id,product_type_id,name,description,sku,price,quantity} = req.body
        const user_id = req.user.id
        const result = await create_product(category_id, product_type_id,
             user_id, name, description, sku, price, quantity)
        return res.status(201).json({message: "Product created successfully",product: result})
}))

router.patch('/products/:id', 
    authenticate, 
    authorize_roles("Admin", "Employee"),
    validate(update_product_sc),
    async_handler(async(req,res)=>{
        const pro_id = req.params.id
        const user_id = req.user.id
        const result = await update_product(pro_id,user_id,req.body)
        return res.status(200).json({message: "Product updated successfully",product: result})
}))

module.exports=router