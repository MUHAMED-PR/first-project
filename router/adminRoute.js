const express = require('express')
const adminRoute = express.Router();
const path = require('path')
const session = require('express-session')
const adminController = require('../controllers/adminController')
const app = express()



app.set('view engine','ejs')
app.set('views', './views/admin');


adminRoute.get('/dashboard',adminController.adminDashboard)
adminRoute.get('/login',adminController.adminLogin)
adminRoute.get('/users',adminController.costumer)
adminRoute.post('/login',adminController.adminVerify)

module.exports = adminRoute;