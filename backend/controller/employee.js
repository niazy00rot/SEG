const router = require('express').Router
const {get_id} = require('../config/helper.js')
const {add_employee,delete_employee,get_employees} = require('../service/employee.js')
const {is_admin} = require('../service/admin.js')
const {is_employee} = require('../service/employee.js')

router.get('/employees', async(req,res)=>{
    try{
        const token = req.cookies?.session;
        if (!token) {return res.status(401).json({error: "Not authenticated"});
        }
        const id = get_id(token)
        if(!id){
            return res.status(401).json({error: "Invalid or expired token" });
        }
        const admin = is_admin(id)
        if(!admin){
            return res.status(403).json({ error: "Admin access required" });
        }
        const employees = await get_employees();
        return res.status(200).json({ employees });

    }
    catch(err){
        console.error('Error fetching employees:', err); 
        return res.status(500).json({ error: 'Error fetching employees' });
    }
})

router.post('/employee', async(req,res)=>{
    const 
})