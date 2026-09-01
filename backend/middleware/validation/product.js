const {z} = require('zod')

const create_product_sc = z.object({
    category_id: z.uuid(),
    product_type_id: z.uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    sku: z.string().min(1),
    price: z.number().min(0),
    quantity: z.int().min(0)
})

const update_product_sc = z.object({
    category_id: z.uuid().optional(),
    product_type_id: z.uuid().optional(),
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    sku: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    quantity: z.int().min(0).optional()
}).refine(
    data => Object.keys(data).length > 0,{
        message: "At least one field must be provided"
    }
)


module.exports = {
    create_product_sc,
    update_product_sc
}