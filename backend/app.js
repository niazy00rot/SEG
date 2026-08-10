const path = require('path')
const express = require('express')
const app = express()

const cors = require('cors')
const helmet = require('helmet')
app.use(helmet())
app.use(cors())

const root_router = require('./apis/root.js')
const users_router = require('./apis/users.js')

app.use('/',root_router)
app.use('/',users_router)


const port = 3001
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})