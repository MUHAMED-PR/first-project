const express = require('express')
const userRoute = express.Router()
const path = require('path')
const session = require('express-session')
const userController = require("../controllers/userController");
const app = express()
const config = require('../config/config')


app.set('view','../views/user')
app.set('views', path.join(__dirname, 'views', 'user'));

userRoute.use(session({secret:config.sessionSecret}))
// userRoute.use(session({
//     secret:'fjlsdflsdlfas',
//     resave:false,
//     saveUninitialized:true

// }))

userRoute.get('/',userController.homePage)
userRoute.get('/signup',userController.signUp);
userRoute.post('/register',userController.insertUser)
userRoute.post('/home',userController.verifyOTP)
userRoute.get('/resend',userController.resendOTP)
userRoute.post('/userlogin',userController.userLogin)



module.exports=userRoute;


