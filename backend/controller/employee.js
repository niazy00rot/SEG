const router = require('express').Router()
const {get_id} = require('../config/helper.js')
const {add_employee,delete_employee,get_employees} = require('../service/employee.js')
const {is_admin} = require('../service/admin.js')

const {authorize_roles} = require('../middleware/auth.js')

router.get('/employee', authorize_roles('Admin'), async(req,res)=>{
    try{
        
        const employees = await get_employees();
        return res.status(200).json({ employees });

    }
    catch(err){
        console.error('Error fetching employees:', err); 
        return res.status(500).json({ error: 'Error fetching employees' });
    }
})

router.post('/employee', authorize_roles("Admin"), async(req,res)=>{
    const {name, email, password,phone} = req.body
    try{
        const results = await add_employee(name,email,password,phone)
        if (results.err){
            console.error('Error occurred while adding employee:', results.err)
            res.status(500).json({error: results.error})
        }
        else{
            res.status(201).json({message: 'adding employee successfully'})
            }
    }
    catch(err){
        console.error('Error occurred while adding employee:', err)
        res.status(500).json({error: 'Error occurred while adding employee'})
    }
})

router.delete('/employee/:id', authorize_roles("Admin"), async(req,res)=>{
    try{
        const {id} = req.params
        const results = delete_employee(id)
        if (results.err){
            console.error('Error occurred while deleting employee:', results.err)
            res.status(500).json({error: 'Error occurred while deleting employee'})
        }
        else{
            res.status(201).json({message: 'deleting employee successfully'})
            }
    }
    catch(err){
        console.error('Error occurred while deleting employee:', err)
        res.status(500).json({error: 'Error occurred while deleting employee'})
    }
})

module.exports= router