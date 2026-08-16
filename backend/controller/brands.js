const router = require('express').Router();

const {add_brand,get_brands,get_brand_by_id,
    update_brand,delete_brand,add_model,
    get_models_by_brand,update_model,delete_model} = require('../service/brands.js')

const {is_admin} = require('../service/admin.js')
const {is_employee} = require('../service/employee.js')

const jwt = require('jsonwebtoken')

router.post('/brands', async(req, res) =>{
    try{
        const {name} =req.body
        const token =req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const userId = decoded.id
        const admin = await is_admin(userId)
        if (admin){
            const brand= await add_brand(name)
            if (brand.length > 0){
                return res.status(201).json(brand)
            }
            else{
                return res.status(400).json({message: 'This brand already exists'})
            }
        }
        else{
            return res.status(403).json({message: 'You are not authorized to add a brand'})
        }
    }
    catch(err){
        console.error('Error adding brand:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/brands', async(req, res)=>{
    try{
        const brands = await get_barnds()
        return res.status(200).json(brands)
    }
    catch(err){
        console.error('Error fetching brands:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/brands/:id', async(req, res)=>{
    try{
        const {id} = req.params
        const brand = await get_brand_by_id(id)
        if (brand){
            return res.status(200).json(brand)
        }
        return res.status(404).json({message: 'Brand not found'})
    }
    catch(err){
        console.error('Error fetching brand by ID:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.put('/brands/:id', async(req, res)=>{
    try{
        const {id} = req.params
        const {name}= req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const userId = decoded.id
        const admin = await is_admin(userId)
        if (admin){
            const updatedBrand = await update_brand(id, name)
            if (updatedBrand.error){
                return res.status(404).json({message: updatedBrand.error})
            }
            return res.status(200).json(updatedBrand)
        }
        else{
            return res.status(403).json({message: 'You are not authorized to update a brand'})
        }
    }
    catch(err){
        console.error('Error updating brand:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.delete('/brands/:id', async(req, res)=>{
    try{
        const {id} = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const userId = decoded.id
        const admin = await is_admin(userId)
        if (admin){
            const deletedBrand = await delete_brand(id)
            if (deletedBrand.error){
                return res.status(404).json({message: deletedBrand.error})
            }
            return res.status(200).json(deletedBrand)
        }
        else{
            return res.status(403).json({message: 'You are not authorized to delete a brand'})
        }
    }
    catch(err){
        console.error('Error deleting brand:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.post('/brands/:id/models', async(req, res)=>{
    try{
        const {id} = req.params
        const {name = req.body} = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const userId = decoded.id
        const admin = await is_admin(userId)
        const employee = await is_employee(userId)
        if (admin || employee){
            const model = await add_model(id, name)
            if (model.length > 0){
                return res.status(201).json(model)
            }
            else{
                return res.status(400).json({message: 'This model already exists for this brand'})
            }
        }
        else{
            return res.status(403).json({message: 'You are not authorized to add a model'})
        }
    }
    catch(err){
        console.error('Error adding model:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.put('/brands/:brand_id/models/:model_id', async(req, res)=>{
    try{
        const{brand_id, model_id} = req.params
        const {name} = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const userId = decoded.id
        const admin = await is_admin(userId)
        const employee = await is_employee(userId)
        if (admin || employee){
            const updatedModel = await update_model(brand_id, model_id, name)
            if (updatedModel.error){
                return res.status(404).json({message: updatedModel.error})
            }
            return res.status(200).json(updatedModel)
        }
        else{
            return res.status(403).json({message: 'You are not authorized to update a model'})
        }
    }
    catch(err){
        console.error('Error updating model:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.delete('/brands/:brand_id/models/:model_id', async(req,res)=>{
    try{
        const {brand_id, model_id}= req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.jwt_secret)
        const id= decoded.id
        const admin = await is_admin(id)
        const employee = await is_employee(id)
        if(admin || employee){
            const result = await delete_model( model_id)
            if(result.error){
                return res.status(404).json({message: res.error})
            }
            return res.status(200).json({message: 'Model deleted successfully'})
        }
        else{
            return res.status(403).json({message: 'You are not authorized to delete a model'})
        }
    }
    catch(err){
        console.error('Error deleting model:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})
module.exports = router