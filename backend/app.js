const path = require('path')
const express = require('express')
const app = express()



require('dotenv').config({ path: path.join(__dirname, './.env') })

const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require("cookie-parser");
app.use(helmet())

app.use(
    cors({
        origin: [
            "https://seg-navy.vercel.app",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);
app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const passport = require('./config/passport.js')
app.use(passport.initialize())

const root_router = require('./controller/root.js')
const users_router = require('./controller/users.js')
const oauth_router = require('./controller/oauth.js')
const vehicles_router = require('./controller/brands.js')
const employees_router = require('./controller/employee.js')

app.use('/',root_router)
app.use('/',users_router)
app.use('/auth',oauth_router)
app.use('/',vehicles_router)
app.use('/',employees_router)


const port = 3001
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})