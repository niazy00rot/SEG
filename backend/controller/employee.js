const router = require('express').Router()
const {add_employee,delete_employee,
        get_employees, get_employee_by_id,update_employee} = require('../service/employee.js')
const {async_handler} = require('../middleware/handler.js')

const {authorize_roles,authenticate} = require('../middleware/auth.js')

router.get('/employee', authenticate,authorize_roles('Admin'), async_handler(async(req,res)=>{
        const employees = await get_employees();
        return res.status(200).json({ employees });
}))
router.get('/employee/:id', authenticate,authorize_roles('Admin'), async_handler(async(req,res)=>{
    const {id} = req.params;
    const employee = await get_employee_by_id(id);
    if (!employee) {
        return res.status(404).json({
            error: 'No employee found'
        });
    }
    if(employee.error){
        return res.status(500).json({error: employee.error});
    }
    return res.status(200).json({employee});
}))

router.post('/employee', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{
    const {name,email,password,phone} = req.body
    const results = await add_employee(name,email,password,phone)
    if (results.err){
        console.error('Error occurred while adding employee:', results.err)
        res.status(500).json({error: 'Error occurred while adding employee'})
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

router.put('/employee/:id', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{
    const {id} = req.params
    const {name, email, password, phone} = req.body
    const results = await update_employee(id,name,email,password,phone)
    if (results.err){
        console.error('Error occurred while updating employee:', results.err)
        res.status(500).json({error: 'Error occurred while updating employee'})
    }
    else{
        res.status(201).json({message: 'updating employee successfully'})
    }
}))

module.exports= router