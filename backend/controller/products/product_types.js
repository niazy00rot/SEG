const { 
get_types_by_category: get_types_by_category_service,
get_product_types: get_product_types_service,
get_type_by_id: get_type_by_id_service,
add_type: add_type_service,
update_type: update_type_service,
delete_type: delete_type_service,
} = require('../../service/products/product_types.js')

async function get_types_by_category(req, res) {
    const { category_id } = req.params
    const result = await get_types_by_category_service(category_id)
    return res.status(200).json(result)
}

async function get_product_types(req, res) {
    const result = await get_product_types_service()
    return res.status(200).json(result)
}

async function get_type_by_id(req, res) {
    const { id } = req.params
    const result = await get_type_by_id_service(id)
    return res.status(200).json(result)
}

async function add_type(req, res) {
    const { category_id, name } = req.body
    const result = await add_type_service(category_id, name)
    return res.status(201).json(result)
}

async function update_type(req, res) {
    const { id } = req.params
    const { name } = req.body
    const result = await update_type_service(id, name)
    return res.status(200).json(result)
}

async function delete_type(req, res) {
    const { id } = req.params
    const result = await delete_type_service(id)
    return res.status(200).json(result)
}

module.exports = {
    get_types_by_category,
    get_product_types,
    get_type_by_id,
    add_type,
    update_type,
    delete_type
}