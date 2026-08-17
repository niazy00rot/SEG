const router = require('express').Router

const {add_vehicles,delet_vehicles} =require('../service/vehicles.js')

const {is_admin} = require('../service/admin.js')
const {is_employee} = require('../service/employee.js')

const jwt = require('jsonwebtoken')

router.post('/vehicle', async(req,res)=>{
    try{
        const {brand_id,model_id,year} = req.body
        const token = req.headers.authorization.split(' ')[1]
        const d= jwt.verify(token,process.env.jwt_secret)
        const id = d.id
        const admin = await is_admin(id)
        const employee = await is_employee(id)
        if(admin || employee){
            const result = add_vehicles(brand_id,model_id,year)
            if(result.err){
                return res.status(400).json({message: result.err})
            }
            return res.status(201).json({message: 'Vehicle added successfully'})
        }
    }
    catch(err){
        return res.status(500).json({message: 'Something went wrong'})
    }
})