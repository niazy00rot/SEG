const router = require('express').Router
const jwt = require('jsonwebtoken')
const {add_employee,delete_employee,get_employees} = require('../service/employee.js')

router.post