const {pool} = require('../../database/db.js')

async function is_product_type(id){
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT id FROM product_types WHERE id = $1',[id])
        return res.rows.length > 0
    }
    catch(err){
        console.error('Error check product_type:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function get_product_types(){
    const client = await pool.connect()
    try{
        const res = client.query('SELECT * FROM product_types')
        if (res.rows.length===0){
            return{error:"No types found"}
        }
        return res.rows
    }
    catch(err){
        console.error('Error get product_types:', err)
        return {error: 'Error get product_types'}
    }
    finally{
        client.release()
    }
}


async function get_type_by_id(id){
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT * FROM product_types WHERE id = $1',[id])
        if (res.rows.length===0){
            return{error:"Type not found"}
        }
        return res.rows[0]
    }
    catch(err){
        console.error('Error get product_type:', err)
        return {error: 'Error get product_type'}
    }
    finally{
        client.release()
    }
}

async function add_type(name){
    const client = await pool.connect()
    try{
        const res = await client.query('INSERT INTO product_types ($1) VALUES ($2) RETURNING *',[name])
        if (res.rows.length===0){
            return {error: 'product_type not added'}
        }
        return res.rows[0]
    }
    catch(err){
        console.error('Error add product_type:', err)
        return {error: 'Error add product_type'}
    }
    finally{
        client.release()
    }
}

async function update_type(id, name){
    const client = await pool.connect()
    try{
        const res = await client.query('UPDATE product_types SET name = $1 WHERE id = $2 RETURNING *',[name,id])
        if (res.rows.length===0){
            return {error: 'product_type not found'}
        }
        return res.rows[0]
    }
    catch(err){
        console.error('Error update product_type:', err)
        return {error: 'Error update product_type'}
    }
    finally{
        client.release()
    }
}

async function delete_type(id){
   
}

module.exports = {
    get_product_types,
    get_type_by_id,
    add_type,
    update_type,
    delete_type,
    is_product_type
}