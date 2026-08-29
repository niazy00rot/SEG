const {pool} = require('../database/db.js')

async function get_categories(){
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT * from categories')
        if (res.rows.length===0){
            return{error:"No categories found"}
        }
        return res.rows
    }
    catch(err){
        console.error('Error get categories:', err)
        return {error: 'Error get categories'}
    }
    finally{
        client.release()
    }
}

async function get_category_by_id(id){
    const client = await pool.connect()
    try{
        const res = await client.query('SELECT * FROM categories WHERE id = $1',[id])
        if (res.rows.length===0){
            return{error:"Category not found"}
        }
        return res.rows[0]
    }
    catch(err){
        console.error('Error get category:', err)
        return {error: 'Error get category'}
    }
    finally{
        client.release()
    }
}

async function add_category(name){
    const client = await pool.connect()
    try{
        const res = await client.query('INSERT INTO categories ($1) VALUES ($2) RETURNING *',[name])
        if (res.rows.length===0){
            return {error: 'Category not added'}
        }
        return res.rows[0]
    }
    catch(err){
        console.error('Error add category:', err)
        return {error: 'Error add category'}
    }
    finally{
        client.release()
    }
}

async function update_category(id, name){
    const client = await pool.connect()
    try{
        const res = await client.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',[name,id])
        if (res.rows.length===0){
            return {error: 'Category not found'}
        }
        return res.rows[0]
    }
    catch(err){
        console.error('Error update category:', err)
        return {error: 'Error update category'}
    }
    finally{
        client.release()
    }
}

async function delete_category(id){
   
}

module.exports = {
    get_categories,
    get_category_by_id,
    add_category,
    update_category,
    delete_category
}