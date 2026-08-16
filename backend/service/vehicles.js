const {pool} = require('../database/db.js')

async function add_vehicles(brand_id, model_id, year){
    const client = await pool.connect()
    try{
        const res = await client.query(`
            INSERT INTO vehicles (brand_id,model_id,year) 
            VALUES ($1,$2,$3) RETURNING *`,[brand_id,model_id,year])
        if(res.rows.length > 0){
            return res.rows[0]
        }
        return {error: 'Brand or model not found'}
    }
    catch(err){
        console.error('Error ', err)
        throw err
    }
    finally{
        client.release()
    }

}

async function delet_vehicles(brand_id, model_id, year){
    const client = await pool.connect()
    try{
        const res = await client.query(`
            INSERT INTO vehicles (brand_id,model_id,year) 
            VALUES ($1,$2,$3) RETURNING *`,[brand_id,model_id,year])
        if(res.rows.length > 0){
            return res.rows[0]
        }
        return {error: 'Brand or model not found'}
    }
    catch(err){
        console.error('Error ', err)
        throw err
    }
    finally{
        client.release()
    }
}

module.exports ={
    add_vehicles,
    delet_vehicles
}