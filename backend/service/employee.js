const {pool} = require('../database/db.js')

async function get_employees(){
    const client = pool.connect()
    try{
        const res = await client.query(``)
    }
    catch(err){}
}

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
            INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) returning id`, [name, email, password, role_id])
        if (result.rows.length === 0){
            return {err: 'Failed to add employee'}
        }
        return result.rows[0].id
    }
    catch(err){
        console.error('Error adding employee:', err)
        return {err: 'Error adding employee'}
    }
    finally{
        client.release()
    }
}

async function delete_employee(employee_id){
    const client = await pool.connect()
    try{
        await client.query(`DELETE FROM users WHERE id = $1 `, [employee_id])
        return {success: 'Employee deleted successfully', id }
    }
    catch(err){
        console.error('Error deleting employee:', err)
        return {err: 'Error deleting employee'}
    }
    finally{
        client.release()
    }
}

module.exports={
    is_employee,
    add_employee,
    delete_employee
}