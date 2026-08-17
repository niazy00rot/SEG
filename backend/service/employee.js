const {pool} = require('../database/db.js')

async function is_employee(userId){
    const client = await pool.connect()
    try{
        const result = await client.query(`
            SELECT roles.name FROM users
            JOIN roles on users.role_id = roles.id
            WHERE users.id = $1`, [userId])
        return result.rows[0].name === 'employee'    
    }
    catch(err){
        console.error('Error checking if user is employee:', err)
        throw err
    }
    finally{
        client.release()
    }
}

async function add_employee(name, email, password){
    const client = await pool.connect()
    try{
        const role_result = await client.query(`SELECT id FROM roles WHERE name = 'employee'`)
        const role_id = role_result.rows[0].id
        const result = await client.query(`
            INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)
        `, [name, email, password, role_id])

    }
}

module.exports={
    is_employee
}