const router = require('express').Router();

const {add_brand,get_brands,get_brand_by_id,
    update_brand,delete_brand,add_model,
    get_models_by_brand,update_model,delete_model} = require('../service/brands.js')

const {async_handler} = require('../middleware/handler.js')
const {authorize_roles,authenticate} = require('../middleware/auth.js')

router.post('/brands', authenticate, authorize_roles("Admin","Employee"),async_handler(async(req, res) =>{
    const {name} =req.body
    const brand= await add_brand(name)
    if (brand.length > 0){
        return res.status(201).json(brand)
    }
    return res.status(400).json({message: 'This brand already exists'})
}))

router.get('/brands', async_handler(async(req, res)=>{
    const brands = await get_brands()
    return res.status(200).json(brands)
}))

router.get('/brands/:id', async_handler(async(req, res)=>{
    const {id} = req.params
    const brand = await get_brand_by_id(id)
    if (!brand) {
    return res.status(404).json({message: 'Brand not found'});
    }
    return res.status(200).json(brand);
}))

router.put('/brands/:id', authenticate, authorize_roles("Admin", "Employee"), async_handler(async(req, res)=>{
    const {id} = req.params
    const {name}= req.body
    const updatedBrand = await update_brand(id, name)
    if (updatedBrand.error){
        return res.status(404).json({message: updatedBrand.error})
    }
    return res.status(200).json(updatedBrand)
}))

router.delete('/brands/:id', authenticate, authorize_roles("Admin","Employee") , async_handler(async(req, res)=>{
    const {id} = req.params
    const deletedBrand = await delete_brand(id)
    if (deletedBrand.error){
        return res.status(404).json({message: deletedBrand.error})
    }
    return res.status(200).json(deletedBrand)
}))

router.post('/brands/:id/models', authenticate, authorize_roles("Admin","Employee"), async_handler(async(req, res)=>{
    const {id} = req.params
    const {name = req.body} = req.body
    const model = await add_model(id, name)
    if (model.length > 0){
        return res.status(201).json(model)
    }
    return res.status(400).json({message: 'This model already exists for this brand'})
}))

router.put('/brands/:brand_id/models/:model_id', authenticate, authorize_roles("Admin","Employee"), async_handler(async(req, res)=>{
    const{brand_id, model_id} = req.params
    const {name} = req.body
    const updatedModel = await update_model(brand_id, model_id, name)
    if (updatedModel.error){
        return res.status(404).json({message: updatedModel.error})
    }
    return res.status(200).json(updatedModel)
}))

router.delete('/brands/:brand_id/models/:model_id', authenticate, authorize_roles("Admin","Employee"), async_handler(async(req,res)=>{
    const {brand_id, model_id}= req.params
    const result = await delete_model( model_id)
    if(result.error){
        return res.status(404).json({message: res.error})
    }
    return res.status(200).json({message: 'Model deleted successfully'})
}))

router.get('/brands/:id/models', async_handler(async(req, res)=>{
    const {id} = req.params
    const models = await get_models_by_brand(id)
    if (!models || models.length === 0) {
        return res.status(404).json({message: 'No models found for this brand'});
    }
    return res.status(200).json(models);
}));

module.exports = router