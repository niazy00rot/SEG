const router = require('express').Router();

const {add_brand,get_brands,get_brand_by_id,
    update_brand,delete_brand,add_model,
    get_models_by_brand,update_model,delete_model} = require('../service/brands.js')

const {authorize_roles} = require('../middleware/auth.js')

router.post('/brands', authorize_roles("Admin","Employee"),async(req, res) =>{
    try{
        const {name} =req.body
        const brand= await add_brand(name)
        if (brand.length > 0){
            return res.status(201).json(brand)
        }
        return res.status(400).json({message: 'This brand already exists'})
    }
    catch(err){
        console.error('Error adding brand:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/brands', async(req, res)=>{
    try{
        const brands = await get_brands()
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
        if (!brand) {
            return res.status(404).json({message: 'Brand not found'});
        }
        return res.status(200).json(brand);
    }
    catch(err){
        console.error('Error fetching brand by ID:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.put('/brands/:id', authorize_roles("Admin", "Employee"),async(req, res)=>{
    try{
        const {id} = req.params
        const {name}= req.body
        const updatedBrand = await update_brand(id, name)
        if (updatedBrand.error){
            return res.status(404).json({message: updatedBrand.error})
        }
        return res.status(200).json(updatedBrand)
    }
    catch(err){
        console.error('Error updating brand:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.delete('/brands/:id', authorize_roles("Admin","Employee") ,async(req, res)=>{
    try{
        const {id} = req.params
        const deletedBrand = await delete_brand(id)
        if (deletedBrand.error){
            return res.status(404).json({message: deletedBrand.error})
        }
        return res.status(200).json(deletedBrand)
    }
    catch(err){
        console.error('Error deleting brand:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.post('/brands/:id/models', authorize_roles("Admin","Employee"), async(req, res)=>{
    try{
        const {id} = req.params
        const {name = req.body} = req.body
        const model = await add_model(id, name)
        if (model.length > 0){
            return res.status(201).json(model)
        }
        return res.status(400).json({message: 'This model already exists for this brand'})
    }
    catch(err){
        console.error('Error adding model:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.put('/brands/:brand_id/models/:model_id', authorize_roles("Admin","Employee"), async(req, res)=>{
    try{
        const{brand_id, model_id} = req.params
        const {name} = req.body
        const updatedModel = await update_model(brand_id, model_id, name)
        if (updatedModel.error){
            return res.status(404).json({message: updatedModel.error})
        }
        return res.status(200).json(updatedModel)
    }
    catch(err){
        console.error('Error updating model:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.delete('/brands/:brand_id/models/:model_id', authorize_roles("Admin","Employee"), async(req,res)=>{
    try{
        const {brand_id, model_id}= req.params
        const result = await delete_model( model_id)
        if(result.error){
            return res.status(404).json({message: res.error})
        }
        return res.status(200).json({message: 'Model deleted successfully'})
    }
    catch(err){
        console.error('Error deleting model:', err)
        return res.status(500).json({message: 'Internal server error'})
    }
})
module.exports = router