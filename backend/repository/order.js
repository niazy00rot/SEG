const {pool} = require("../database/db.js")
const {transaction} = require('../utils/transactions.js')
async function create_order(){
    const  client =  await pool.connect()
    try{

    }
    catch(err){
        console.error('', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function create_order(){
    const  client =  await pool.connect()
    try{

    }
    catch(err){
        console.error('', err)
        throw err
    }
    finally{
        client.release()
    }
}