const router = require('express').Router();
const {registration, login, get_user_role} = require('../service/users.js')
const jwt= require('jsonwebtoken')
const {get_id}= require('../config/helper.js')
const {async_handler} = require('../middleware/handler.js')

router.post('/register', async_handler(async(req, res)=>{
    const {name,email,password,phone} = req.body
    const results = await registration(name,email,password,phone)
    if (results.err){
        console.error('Error occurred while registering user:', results.err)
        res.status(500).json({error: results.error})
    }
    else{
        res.status(201).json({message: 'User registered successfully'})
    }
}))

router.post('/login', async_handler(async(req, res)=>{
    const {email,password}= req.body
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
        res.status(200).cookie("session", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000
            }).json({message: 'Login successful', role: role_name});
    }
}))

router.get('/me', async_handler(async(req, res)=>{
    const token = req.cookies?.session;
    if (!token) {
        return res.status(401).json({
            error: "Not authenticated"
        });
    }
    const id = get_id(token)
    if(!id){
        return res.status(401).json({error: "Invalid or expired token" });
    }
    const role = await get_user_role(id)
    if(role.error){
        return res.status(404).json({error: role.error})
    }
    else{
        return res.status(200).json({role})
    }
}))


module.exports = router