const {
    get_categories: get_categories_service,
    get_category_by_id: get_category_by_id_service,
    add_category: add_category_service,
    update_category: update_category_service,
    delete_category: delete_category_service
} = require('../../service/products/categories.js');

async function get_categories(req, res) {
    const result = await get_categories_service();
    if (result.error) {
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}

async function get_category_by_id(req, res) {
    const { id } = req.params;
    const result = await get_category_by_id_service(id);
    if (result.error) {
        return res.status(404).json(result);
    }
    return res.status(200).json(result);
}

async function add_category(req, res) {
    const { name } = req.body;
    const result = await add_category_service(name);
    if (result.error) {
        if (result.error === 'Category already exists') {
            return res.status(409).json(result);
        }
        return res.status(500).json(result);
    }
    return res.status(201).json(result);
}

async function update_category(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const result = await update_category_service(id, name);
    if (result.error) {
        if (result.error === 'Category not found') {
            return res.status(404).json(result);
        }
        if (result.error === 'Category already exists') {
            return res.status(409).json(result);
        }
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}

async function delete_category(req, res) {
    const { id } = req.params;
    const result = await delete_category_service(id);
    if (result.error) {
        if (result.error === 'Category not found') {
            return res.status(404).json(result);
        }
        if (result.error === 'Cannot delete category because it is being used') {
            return res.status(409).json(result);
        }
        return res.status(500).json(result);
    }
    return res.status(200).json(result);
}

module.exports = {
    get_categories,
    get_category_by_id,
    add_category,
    update_category,
    delete_category

};