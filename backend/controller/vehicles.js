const router = require('express').Router

const {get_vehicles,add_vehicles,delete_vehicles} =require('../service/vehicles.js')

const {is_admin} = require('../service/admin.js')
const {is_employee} = require('../service/employee.js')
const {async_handler}= require('../middleware/handler.js')
const {authorize_roles,authenticate} = require('../middleware/auth.js')

router.post('/vehicle', authenticate,authorize_roles(['admin','employee']),async_handler(async(req,res)=>{
    const {brand_id,model_id,year} = req.body
    if(!brand_id || !model_id || !year){
        return res.status(400).json({message: 'brand_id, model_id and year are required'})
    }
    const result = add_vehicles(brand_id,model_id,year)
    if(result.err){
        return res.status(400).json({message: result.err})
    }
    return res.status(201).json({message: 'Vehicle added successfully'})    
}))

router.get('/vehicle', async_handler(async(req,res)=>{
    const result = await get_vehicles()
    if(result.err){
        return res.status(400).json({message: result.err})
    }
    return res.status(200).json({vehicles: result})
}))

router.delete('/vehicle', authenticate,authorize_roles(['admin']),async_handler(async(req,res)=>{
    const {brand_id,model_id,year} = req.body
    if(!brand_id || !model_id || !year){
        return res.status(400).json({message: 'brand_id, model_id and year are required'})
    }
    const result = await delete_vehicles(brand_id,model_id,year)
    if(result.err){
        return res.status(400).json({message: result.err})
    }
    return res.status(200).json({message: 'Vehicle deleted successfully'})
}))

module.exports = {router}