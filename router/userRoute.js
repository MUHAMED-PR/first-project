const express = require('express')
const userRoute = express.Router()
const path = require('path')
// const session = require('express-session')

const app = express()
// const config = require('../config/config')
const auth = require('../middleware/auth')
const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController')



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
userRoute.get('/logout',userController.logout)
userRoute.get('/OTP',userController.getOtp)
userRoute.post('/signUp',userController.insertUser)
userRoute.post('/home',userController.verifyOTP)
userRoute.get('/resend',userController.resendOTP)
userRoute.post('/userlogin',userController.verifyLogin) 
userRoute.get('/productPage',userController.loadProductPage)
userRoute.get('/productDetails/:productId',userController.loadProductDetails)

//forgot password
userRoute.get('/forgot-password',userController.forgotPassword)
userRoute.post('/forgot-password',userController.resetPassword)
userRoute.get('/otpresetPassword',userController.otpResetPassword)
userRoute.get('/setNewPassword',userController.setNewPassword)
userRoute.post('/ResetPasswordOTPverify',userController.ResetPasswordOTPverify)
userRoute.get('/ResetPasswordREsendOTP',userController.ResetPasswordREsendOTP)
userRoute.post('/changePassword',userController.changePassword)

userRoute.get('/userProfile',auth.isLogin,userController.userProfile)


//cart
userRoute.get('/cartPage',auth.isLogin,cartController.loadcart)
userRoute.post('/addToCart',cartController.addToCart)
userRoute.get('/removeCart/:productID',cartController.removeCart)
userRoute.patch('/ProductQuantity',cartController.productQuantity)



module.exports=userRoute;


