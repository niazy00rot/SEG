
const {
    get_type_by_category: get_types_by_category_repo,
    get_product_types: get_types_repo,
    get_type_by_id: get_type_by_id_repo,
    add_type: add_type_repo,
    update_type: update_type_repo,
    delete_type: delete_type_repo,
    is_product_type: is_product_type_repo,
    is_product_type_name: is_product_type_name_repo,
    is_product_type_name_except: is_product_type_name_except_repo
} = require('../../repository/products/product_types.js')

async function get_types_by_category(category_id) {
    const res = await get_types_by_category_repo(category_id)
    if (res.length === 0) {
        return {error: 'No product types found for this category'}
    }
    return res
}

async function get_product_types() {
    const res = await get_types_repo()
    if (res.length === 0) {
        return {error: 'No product types found'}
    }
    return res
}

async function get_type_by_id(id) {
    const res = await get_type_by_id_repo(id)
    if (!res) {
        return {error: 'Product type not found'}
    }
    return res
}

async function add_type(category_id, name) {
    const is_name = await is_product_type_name_repo(category_id, name)
    if (is_name) {
        return {error: 'Product type name already exists for this category'}
    }
    return await add_type_repo(name, category_id)
}

async function update_type(id, name) {
    const product_type = await get_type_by_id_repo(id)
    if (!product_type) {
        return {error: 'Product type not found'}
    }

    const is_name = await is_product_type_name_except_repo(product_type.category_id, name, id)
    if (is_name) {
        return {error: 'Product type name already exists for this category'}
    }
    return await update_type_repo(id, name)
}

async function delete_type(id) {
    const is_type = await is_product_type_repo(id)  
    if (!is_type) {
        return {error: 'Product type not found'}
    }
    return await delete_type_repo(id)
}

module.exports = {
    get_types_by_category,
    get_product_types,
    get_type_by_id,
    add_type,
    update_type,
    delete_type
}
