const {pool} = require("../database/db.js")
const {transaction} = require('../utils/transactions.js')

// async function create_order(){
//     const  client =  await pool.connect()
//     try{

//     }
//     catch(err){
//         console.error('', err)
//         throw err
//     }
//     finally{
//         client.release()
//     }
// }

async function create_order(data,user_id,phone_number,city,location=null, address_notes=null) {
    return await transaction(async (client) => {
        const total_price = data.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
        const order_data = await client.query(
            `INSERT INTO orders 
            (user_id, total_price, phone_number, city, location, address_notes) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING order_number, `,
            [user_id, total_price, phone_number, city, location, address_notes]
        );
        const order_id = order_data.rows[0].id;
    })
}