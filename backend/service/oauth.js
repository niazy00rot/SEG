const {pool} = require('../database/db.js')

async function is_registered(email){
    const client = await pool.connect()
    try{
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email])
        if(result.rows.length > 0){
            return true
        }
        return false
    } catch (error) {
        console.error('Error checking if user is registered:', error)
        throw error
    } finally {
        client.release()
    }
}

async function is_google_id_registered(googleId){
    const client = await pool.connect()
    try{
        const result = await client.query('SELECT * FROM users WHERE google_id = $1', [googleId])
        if(result.rows.length > 0){
            return true
        }
        return false
    } catch (error) {
        console.error('Error checking if user is registered:', error)
        throw error
    } finally {
        client.release()
    }
}

async function add_google_id(googleId, email){
    const client = await pool.connect() 
    try{
        await client.query('UPDATE users SET google_id = $1 WHERE email = $2', [googleId, email])
    } 
    catch (error) {
        console.error('Error adding Google ID:', error)
        throw error
    } 
    finally {
        client.release()
    }
}

async function add_user(googleId, name, email){
    const client = await pool.connect()
    try{
        const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', ['Client'])
        const roleId = roleResult.rows[0]?.id
        await client.query(`INSERT INTO 
            users (google_id, name, email, role_id) 
            VALUES ($1, $2, $3, $4)`, [googleId, name, email, roleId])
    } catch (error) {
        console.error('Error adding user:', error)
        throw error
    } finally {
        client.release()
    }
}

async function get_user_id(googleId){
    const client = await pool.connect()
    try{
        const result = await client.query('SELECT id FROM users WHERE google_id = $1', [googleId])
        if(result.rows.length > 0){
            return result.rows[0].id
        }
        return null
    } catch (error) {
        console.error('Error getting user ID:', error)
        throw error
    } finally {
        client.release()
    }
}

module.exports = {
    is_registered,
    add_user,
    get_user_id,
    is_google_id_registered,
    add_google_id
}