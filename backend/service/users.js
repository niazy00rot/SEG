const {pool}= require('../database/db.js')
const bcrypt = require('bcrypt')

async function registration(name,email,password,phone){
    let client
    try{
        client = await pool.connect()

        const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', ['Client'])
        const roleId = roleResult.rows[0]?.id

        if (!roleId) {
            return {error: 'Default role not found'}
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await client.query(
            'INSERT INTO users(name,email,password,phone,role_id) VALUES($1,$2,$3,$4,$5)',
            [name,email,hashedPassword,phone,roleId]
        )
        return {success: true}
    }
    catch(err){
        console.error('Error occurred while registering user:', err)
        return {error: 'Error occurred while registering user'}
    }
    finally{
        if (client) {
            client.release()
        }
    }
}

async function login(email,password){
    try{
        const client = await pool.connect()
        const result = await client.query('SELECT id,email,password FROM users Where email=$1',[email])
        if (result.rows.length === 0){
            return {error: 'User not found'}
        }
        const user = result.rows[0]
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid){
            return {error:' Invalid password'}
        }
        return {success: true, user: {id: user.id}}
    }
    catch(err){
        console.error('Error occurred while logging in:', err)
        return {error: 'Error occurred while logging in'}
    }
    finally{
        client.release()
    }
}

async function getUserById(id){
    try{
        const client = await pool.connect()
        const r= await client.query('SELECT id,name,email,phone FROM users WHERE id=$1',[id])
        return {success: true, user: r.rows[0]}
    }
    catch(err){
        console.error('Error occurred while fetching user:', err)
        return {error: 'Error occurred while fetching user'}
    }
    finally{
        client.release()
    }
}

async function get_user_role(id){
    const client = await pool.connect()
    try{
        const result = await client.query(`
            SELECT roles.name FROM users
            JOIN roles on users.role_id = roles.id
            WHERE users.id = $1`, [id])
        if (result.rows.length === 0){
            return {error: 'User not found'}
        }
        return result.rows[0].name    
    }
    catch(err){
        console.error('Error occurred while fetching user role:', err)
        return {error: 'Error occurred while fetching user role'}
    }
    finally{
        client.release()
    }
}

module.exports = {registration,login,getUserById,get_user_role}