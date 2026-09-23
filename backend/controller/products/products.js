
const {create_product,update_product,delete_product, get_products,
    get_product_by_id} = require("../../service/products/products.js")

async function get_products_controller(req,res){
    //handle the offset
    const {offset} = req.query
    const result = await get_products(offset)
    return res.status(200).json(result)
}

async function get_product_by_id_controller(req,res){
    const {id} = req.params
    const result = await get_product_by_id(id)
    return res.status(200).json(result)
}

async function create_product_controller(req,res){
    const {category_id,product_type_id,name,description,sku,price,quantity} = req.body
    const user_id = req.user.id
    const result = await create_product(category_id, product_type_id,
         user_id, name, description, sku, price, quantity)
    return res.status(201).json({message: "Product created successfully",product: result})
}

async function update_product_controller(req,res){
    const pro_id = req.params.id
    const user_id = req.user.id
    const result = await update_product(pro_id,user_id,req.body)
    return res.status(200).json({message: "Product updated successfully",product: result})
}

async function delete_product_controller(req,res){
    const pro_id = req.params.id
    const result = await delete_product(pro_id,req.user.id)
    return res.status(200).json({message: "Product deleted successfully",product: result})
}

module.exports = {
    get_products_controller,
    get_product_by_id_controller,
    create_product_controller,
    update_product_controller,
    delete_product_controller
}