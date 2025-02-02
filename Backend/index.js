const express = require("express");
const cors = require('cors');
const adminRouter = require("./Routes/AdminRoute.js");
const EmployeeRouter = require("./Routes/EmployeeRoute.js");
const testRoute = require('./Routes/TestRoute.js');
const Jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");

const app = express() 

// For development/testing, allow all origins
app.use(cors({
    origin: true, // or ['http://xiobook-stage.com:3000', 'http://localhost:3000']
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/', testRoute)
app.use('/auth', adminRouter)
app.use('/employee', EmployeeRouter)
app.use(express.static('Public'))

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, "jwt_secret_key", (err ,decoded) => {
            if(err) return res.json({Status: false, Error: "Wrong Token"})
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return res.json({Status: false, Error: "Not autheticated"})
    }
}

app.get('/verify',verifyUser, (req, res)=> {
    return res.json({Status: true, role: req.role, id: req.id})
})

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on Port: ${PORT}`)
})