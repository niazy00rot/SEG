const router = require('express').Router()

const {get_vehicles,add_vehicles,delete_vehicles} =require('../service/vehicles.js')

const {is_admin} = require('../service/admin.js')
const {is_employee} = require('../service/employee.js')
const {async_handler}= require('../middleware/handler.js')
const {authorize_roles,authenticate} = require('../middleware/auth.js')

router.post('/vehicle', authenticate, authorize_roles("Admin", "Employee"), async_handler(async(req,res)=>{
    const {brand_id, model_id, year} = req.body
    if(!brand_id || !model_id || !year){
        return res.status(400).json({message: 'brand_id, model_id and year are required'})
    }
    const result = await add_vehicles(brand_id, model_id, year)
    if(result && result.error){
        return res.status(400).json({message: result.error})
    }
    return res.status(201).json({message: 'Vehicle added successfully', vehicle: result})
}))

router.get('/vehicle', async_handler(async(req,res)=>{
    const result = await get_vehicles()
    if(result.err){
        return res.status(400).json({message: result.err})
    }
    return res.status(200).json({vehicles: result})
}))

router.delete('/vehicle/:id', authenticate, authorize_roles("Admin"), async_handler(async(req,res)=>{
    const {id} = req.params
    const result = await delete_vehicles(id)
    if(result && result.error){
        return res.status(400).json({message: result.error})
    }
    return res.status(200).json({message: 'Vehicle deleted successfully', vehicle: result})
}))

module.exports = router