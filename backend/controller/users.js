const router = require('express').Router();
const {registration, login, get_user_role} = require('../service/users.js')
const jwt= require('jsonwebtoken')

router.post('/register', async(req, res)=>{
    const {name,email,password,phone} = req.body
    try{
        const results = await registration(name,email,password,phone)
        if (results.err){
            console.error('Error occurred while registering user:', results.err)
            res.status(500).json({error: results.error})
        }
        else{
            res.status(201).json({message: 'User registered successfully'})
            }
    }
    catch(err){
        console.error('Error occurred while registering user:', err)
        res.status(500).json({error: 'Error occurred while registering user'})
    }
})

router.post('/login', async(req, res)=>{
    const {email,password}= req.body
    try{
        const results = await login(email,password)
        if(results.error){
            res.status(401).json({error: results.error})
        }
        else{
            const token = jwt.sign({id: results.user.id},process.env.jwt_secret,{expiresIn:'1h'})
            res.status(200).json({token})
        }
    }
    catch(err){
        console.error('Error occurred while logging in:', err)
        res.status(500).json({error: 'Error occurred while logging in'})
    }
})

router.get('/user/:id/role', async(req, res)=>{
    const {id} = req.params
    try{
        const role = await get_user_role(id)
        if(role.error){
            res.status(404).json({error: role.error})
        }
        else{
            res.status(200).json({role})
        }
    }
    catch(err){
        console.error('Error occurred while fetching user role:', err)
        res.status(500).json({error: 'Error occurred while fetching user role'})
    }
})

module.exports = router