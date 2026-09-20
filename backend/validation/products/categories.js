const { z } = require('zod');

const create_category_schema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Category name is required')
        .max(100, 'Category name must not exceed 100 characters')
});

const update_category_schema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Category name is required')
        .max(100, 'Category name must not exceed 100 characters')
});

const category_id_schema = z.object({
    id: z
        .string()
        .uuid('Invalid category ID')
});

module.exports = {
    create_category_schema,
    update_category_schema,
    category_id_schema
};