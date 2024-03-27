const express = require('express')
const userRoute = express.Router()
const session = require('express-session')
const userController = require("../controllers/userController");
const app = express()

// app.set('view','../views/user')




userRoute.get('/signup',userController.signUp);
userRoute.post('/register',userController.insertUser)
userRoute.get('/verify',userController.verifyMail)


module.exports=userRoute;


