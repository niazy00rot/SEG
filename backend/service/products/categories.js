const { AppError } = require('../../middleware/handler.js')
const {
    get_categories: get_categories_repo,
    get_category_by_id: get_category_by_id_repo,
    add_category: add_category_repo,
    update_category: update_category_repo,
    delete_category: delete_category_repo,
    is_category: is_category_repo
} = require('../../repository/products/categories.js');

async function is_category(id) {
    return await is_category_repo(id);
}

async function get_categories() {
    const categories = await get_categories_repo();
    if (categories.length === 0) {
        throw new AppError('No categories found', 404)
    }
    return categories;
}

async function get_category_by_id(id) {
    const category = await get_category_by_id_repo(id);
    if (!category) {
        throw new AppError('Category not found', 404)
    }
    return category;
}

async function add_category(name) {
    try {
        return await add_category_repo(name);
    }
    catch (err) {
        if (err.code === '23505') {
            throw new AppError('Category already exists', 409)
        }
        throw err;
    }
}

async function update_category(id, name) {
    try {
        const category = await update_category_repo(id, name)
        if (!category) {
            throw new AppError('Category not found', 404)
        }
        return category
    }
    catch (err) {
        if (err.code === '23505') {
            throw new AppError('Category already exists', 409)
        }
        throw err
    }
}

async function delete_category(id) {
    try {
        const category = await delete_category_repo(id);
        if (!category) {
            throw new AppError('Category not found', 404)
        }
        return category;
    }
    catch (err) {
        if (err.code === '23503') {
            throw new AppError('Cannot delete category because it is being used', 409)
        }
        throw err;
    }
}
module.exports = {
    get_categories,
    get_category_by_id,
    add_category,
    update_category,
    delete_category,
    is_category
};