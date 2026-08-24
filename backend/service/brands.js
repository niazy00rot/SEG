const {pool} = require('../database/db.js')

const {transaction} = require('../utils/transactions.js')

async function add_brand(name){
    const client = await pool.connect()
    try{
        const result = await client.query('INSERT INTO brands (name) VALUES ($1) RETURNING *', [name])
        if(result.rows.length > 0){
            return result.rows
        }
        return null
    }
    catch(err){
        console.error('Error adding brand:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function get_brands(){
    const client = await pool.connect()
    try {
        const result = await client.query('SELECT * FROM brands')
        return result.rows
    }
    catch(err){
        console.error('Error fetching brands:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function get_brand_by_id(id){
    const client =await pool.connect()
    try{
        const result = await client.query(`SELECT * FROM brands WHERE id = $1`, [id])
        const brand = result.rows[0]
        const models= await client.query(`SELECT * FROM models WHERE brand_id = $1`, [id])
        brand.models = models.rows
        return brand
    }
    catch(err){
        console.error('Error fetching brand by ID:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function update_brand(id, name){
    const client = await pool.connect()
    try{
        const result = await client.query('UPDATE brands SET name = $1 WHERE id = $2 RETURNING *', [name, id])
        if(result.rows.length > 0){
            return result.rows[0]
        }
        return {error: 'Brand not found'}
    }
    catch(err){
        console.error('Error updating brand:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function delete_brand(id){
    return transaction(async (client)=>{
        await client.query('DELETE FROM vehicles WHERE brand_id = $1', [id])
        await client.query('DELETE FROM models WHERE brand_id = $1', [id])
        const result = await client.query('DELETE FROM brands WHERE id = $1 RETURNING *', [id])
        if (result.rows.length === 0) {
            throw new Error("Brand not found");
        }
        return result.rows[0];
    })
}


async function add_model(brand_id, name){
    const client = await pool.connect()
    try{
        const res = await client.query(`INSERT INTO models (brand_id, name) 
            VALUES ($1,$2) RETURNING *`,[brand_id, name])
        if(res.rows.length > 0){
            return res.rows[0]
        }
        return {error: 'Model not added'}
    }
    catch(err){
        console.error('Error adding model:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function get_models_by_brand(brand_id){
    const client = await pool.connect()
    try{
        const res = await client.query(`
            SELECT * FROM models
            WHERE brand_id = $1`,[brand_id])
        if(res.rows.length > 0){
            return res.rows
        }
        return {error: 'No models found for this brand'}
    }
    catch(err){
        console.error('Error fetching models by brand:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function update_model(id, name){
    const client = await pool.connect()
    try{
        const result = await client.query('UPDATE models SET name = $1 WHERE id = $2 RETURNING *', [name, id])
        if(result.rows.length > 0){
            return result.rows[0]
        }
        return {error: 'Model not found'}
    }
    catch(err){
        console.error('Error updating model:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function delete_model(id){
    return transaction(async(client)=>{
        await client.query('DELETE FROM vehicles WHERE model_id = $1', [id])
        const result = await client.query('DELETE FROM models WHERE id = $1 RETURNING *', [id])
        if (result.rows.length === 0) {
            throw new Error("Model not found");
        }
        return result.rows[0];
    })
}



module.exports = {
    add_brand,
    get_brands,
    get_brand_by_id,
    update_brand,
    delete_brand,
    add_model,
    get_models_by_brand,
    update_model,
    delete_model
}       

