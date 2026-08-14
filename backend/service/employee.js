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

module.exports={
    is_employee
}