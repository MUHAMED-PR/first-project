const express = require('express')
const userRoute = express.Router()
const session = require('express-session')
const userController = require("../controllers/userController");
const app = express()
const config = require('../config/config')

// app.set('view','../views/user')
userRoute.use(session({secret:config.sessionSecret}))
// userRoute.use(session({
//     secret:'fjlsdflsdlfas',
//     resave:false,
//     saveUninitialized:true

// }))


userRoute.get('/',userController.homePage)
userRoute.get('/signup',userController.signUp);
userRoute.post('/register',userController.insertUser)
userRoute.post('/verify',userController.verifyMail)
userRoute.get('/resend',userController.resendOTP)



module.exports=userRoute;


