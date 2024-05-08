const express = require('express')
const userRoute = express.Router()
const path = require('path')
// const session = require('express-session')
const userController = require("../controllers/userController");
const app = express()
const config = require('../config/config')
const auth = require('../middleware/auth')
const passport = require('passport')
require('../passport')

userRoute.use(passport.initialize());
userRoute.use(passport.session())




app.set('views','./views/user')
// app.set('views', path.join(__dirname, 'views', 'user'));

// userRoute.use(session({secret:config.sessionSecret}))
// userRoute.use(session({
//     secret:'fjlsdflsdlfas',
//     resave:false,
//     saveUninitialized:true

// }))


//Auth
userRoute.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile']}))

//Aut Callback
userRoute.get('/auth/google/callback',
    passport.authenticate( 'google',{
       successRedirect: '/success',
       failureRedirect: '/failure' 
    })
);


userRoute.get('/success', userController.successGoogleLogin)

//failure
userRoute.get('/failure', userController.failureGoogleLogin)

userRoute.get('/',userController.homePage)
userRoute.get('/signIn',userController.signIn);
userRoute.get('/signUp',userController.signUp);
userRoute.get('/OTP',userController.getOtp)
userRoute.post('/signUp',userController.insertUser)
userRoute.post('/home',userController.verifyOTP)
userRoute.get('/resend',userController.resendOTP)
userRoute.post('/userlogin',userController.verifyLogin) 
userRoute.get('/shopPage',userController.loadShopPage)
userRoute.get('/productDetails/:productId',userController.loadProductDetails)
userRoute.get('/forgot-password',userController.forgotPassword)
userRoute.post('/forgot-password',userController.resetPassword)




module.exports=userRoute;


