const {pool} = require('../database/db.js')

async function transaction(cb){
    const client = await pool.connect()

    try{
        await client.query('BEGIN')
        const res = await cb(client)
        await client.query('COMMIT')
        return res
    }
    catch(err){
        await client.query('ROLLBACK')
        throw err
    }
    finally{
        client.release()
    }
}

module.exports = {transaction}