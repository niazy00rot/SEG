const router = require('express').Router()

const {async_handler} = require('../../middleware/handler.js')
const {authorize_roles,authenticate} = require('../../middleware/auth.js')
const {validate} = require('../../middleware/validation/validate.js')
const {create_product_sc} = require('../../middleware/validation/product.js')
const {create_product} = require("../../service/products/products.js");

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

module.exports=router