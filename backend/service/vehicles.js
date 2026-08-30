const {pool} = require('../database/db.js')

async function get_vehicles(){
    const client = await pool.connect()
    try{
        const res = await client.query(`
            SELECT vehicles.id, brands.name as brand, models.name as model, vehicles.year FROM vehicles
            JOIN brands on vehicles.brand_id = brands.id
            JOIN models on vehicles.model_id = models.id`)
        return res.rows
    }
    catch(err){
        console.error('Error ', err)
        throw err
    }
    finally{
        client.release()
    }
}

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

async function delete_vehicles(brand_id, model_id, year){
    const client = await pool.connect()
    try{
        const res = await client.query(`
            DELETE FROM vehicles 
            WHERE brand_id = $1 AND model_id = $2 AND year = $3 
            RETURNING *`,[brand_id,model_id,year])
        if(res.rows.length > 0){
            return res.rows[0]
        }
        return {error: 'Vehicle not found'}
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
    delete_vehicles,
    get_vehicles
}