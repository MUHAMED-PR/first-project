const express = require('express')
const adminRoute = express.Router();
const path = require('path')
const session = require('express-session')
const adminController = require('../controllers/adminController')
const app = express()



app.set('view','../views/admin')
app.set('views', path.join(__dirname, 'views', 'admin'));


adminRoute.get('/dashboard',adminController.adminDash)

module.exports = adminRoute;