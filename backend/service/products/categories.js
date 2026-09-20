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
        return {
            error: 'No categories found'
        };
    }
    return categories;
}

async function get_category_by_id(id) {
    const category = await get_category_by_id_repo(id);
    if (!category) {
        return {
            error: 'Category not found'
        };
    }
    return category;
}

async function add_category(name) {
    try {
        return await add_category_repo(name);
    }
    catch (err) {
        if (err.code === '23505') {
            return {
                error: 'Category already exists'
            };
        }
        throw err;
    }
}

async function update_category(id, name) {
    const category = await update_category_repo(id, name);
    if (!category) {
        return {
            error: 'Category not found'
        };
    }
    return category;
}
async function delete_category(id) {
    try {
        const category = await delete_category_repo(id);
        if (!category) {
            return {
                error: 'Category not found'
            };
        }
        return category;
    }
    catch (err) {
        if (err.code === '23503') {
            return {
                error: 'Cannot delete category because it is being used'
            };
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