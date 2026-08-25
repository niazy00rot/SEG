const router = require('express').Router()
const {add_employee,delete_employee,get_employees} = require('../service/employee.js')
const {async_handler} = require('../middleware/handler.js')

const {authorize_roles,authenticate} = require('../middleware/auth.js')

router.get('/employee', authenticate,authorize_roles('Admin'), async_handler(async(req,res)=>{
        const employees = await get_employees();
        return res.status(200).json({ employees });
}))

router.post('/employee', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{
    const {name, email, password,phone} = req.body
    const results = await add_employee(name,email,password,phone)
    if (results.err){
        console.error('Error occurred while adding employee:', results.err)
        return res.status(500).json({error: results.err})
    }
    else{
        res.status(201).json({message: 'adding employee successfully'})
    }
}))

router.delete('/employee/:id', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{
    const {id} = req.params
    const results = await delete_employee(id)
    if (results.err){
        console.error('Error occurred while deleting employee:', results.err)
        res.status(500).json({error: 'Error occurred while deleting employee'})
        }
    else{
        res.status(201).json({message: 'deleting employee successfully'})
    }
}))

module.exports= router