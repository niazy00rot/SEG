const {z} = require("zod")

const create_order_sc = z.object({
    phone: z.string().trim().min(1, 'Phone number is required'),
    city: z.string().trim().min(1, 'City is required'),
    location: z.string().trim().optional(),
    address_notes: z.string().trim().optional(),
    items: z.array(z.object({
        product_id: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1')
    })).min(1, 'At least one item is required')
})

const order_id_sc = z.object({
    id: z.string().uuid('Invalid order ID')
})

module.exports = {
    create_order_sc,
    order_id_sc
}