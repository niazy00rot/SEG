const {z} = require('zod')

const create_product_sc = z.object({
    category_id: z.uuid(),
    product_type_id: z.uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    sku: z.string().min(1),
    price: z.number().min(0),
    quantity: z.number().min(0)
})


module.exports = {
    create_product_sc
}