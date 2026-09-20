const {z} = require('zod')

const product_type_id_schema= z.object({
    id: z.string().uuid('Invalid product_type ID')
})

const category_id_schema = z.object({
    category_id: z.string().uuid('Invalid category ID')
})

const create_product_type_schema = z.object({
    category_id: z.string().uuid('Invalid category ID'),
    name: z
        .string()
        .trim()
        .min(1, 'product_type is required')
        .max(100, 'product_type name must not exceed 100 characters')
});

const update_product_type_schema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'product_type is required')
        .max(100, 'product_type name must not exceed 100 characters')
});

module.exports={
    product_type_id_schema,
    category_id_schema,
    create_product_type_schema,
    update_product_type_schema
}