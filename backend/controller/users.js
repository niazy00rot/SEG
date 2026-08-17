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
            const role_name = await get_user_role(results.user.id)
            if(role_name.error){
                return res.status(404).json({error: role_name.error})
            }
            const token = jwt.sign({id: results.user.id},process.env.jwt_secret,{expiresIn:'1h'})
            res.status(200).json({message: 'Login successful', token, role: role_name})
        }
    }
    catch(err){
        console.error('Error occurred while logging in:', err)
        res.status(500).json({error: 'Error occurred while logging in'})
    }
})

module.exports = router