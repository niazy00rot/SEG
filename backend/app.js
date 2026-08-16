const path = require('path')
const express = require('express')
const app = express()

const cors = require('cors')
const helmet = require('helmet')
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const root_router = require('./controller/root.js')
const users_router = require('./controller/users.js')
const vehicles_router = require('./controller/brands.js')

app.use('/',root_router)
app.use('/',users_router)
app.use('/',vehicles_router)


const port = 3001
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})