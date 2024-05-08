// const { tryCatch } = require('engine/utils');
const users = require('../models/users')
const OTP = require('../models/OTP')
const product = require('../models/product')
const bcrypt = require('bcrypt')
const { tryCatch } = require('engine/utils')
const nodemailer = require('nodemailer')
const flash = require('express-flash')
require('dotenv').config()



const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const homePage = (req,res)=>{
    try {
        res.render('user/homePage')
    } catch (error) {
        console.log(error);
    }
}


const signIn = (req, res) => {
    try {
        res.render('user/signIn', { message: '' });
    } catch (error) {
        console.log(error);

    }
}
const signUp = async(req,res)=>{
    try {
        res.render('user/signUp', {message:''})
    } catch (error) {
        console.log(error)
    }
}
const otpGenerate =  (req,res) => {
    try {
console.log('otp is generating');
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }


        return OTP;

    } catch (error) {
        conosle.log(error)
    }

}



const saveOtp = async (email, otp) => {
    try {
        // console.log(email,' email otp sended..');
        // console.log(otp,' saved otp ');

        let saveOtp = new OTP({
            email: email,
            otp: otp
        })
       await saveOtp.save();


    } catch (error) {
        console.log(error.message)
    }
}


const getOtp = async (req,res)=>{
    try {
        res.render('user/OTP')
    } catch (error) {
        console.error('Error foundednin get otp',error);
    }
}
//registration of a user
const insertUser = async (req, res) => {
    try {
        res.render('user/signUp')

        const regex = new RegExp(req.body.email, 'i');
        const emailExisting = await users.findOne({ email: regex });
        

       

        if (emailExisting) {
            const message = 'This email is already registered!'
            return res.render('user/signUp', { message: message })
        }
        const spassword = await securePassword(req.body.password)
        // console.log('spassword.....     '+spassword)

        const user = new users({
            userName: req.body.name,
            email: req.body.email,
            password: spassword,
            cpassword: spassword,
            mobile: req.body.mobile
        })
       
        const userData = await user.save()
        console.log('userData....     '+userData)

        if (userData) {
            const genotp = otpGenerate()
            console.log(genotp + ' is the otp');
            req.session.email = req.body.email
           
            let savingotp = saveOtp(req.body.email , genotp)
            let response = sendVerifyMail(req.body.name, req.body.email, userData._id, genotp)

            // const message = 'your registration has been successful'
            // res.render('registration',{message:message})
            console.log(typeof message)
            res.render('user/OTP',{message:''})
        }
        else {
            const message = 'your registration has been failed'
            res.render('user/signUp', { message:''})
        }

    } catch (error) {
        console.log(error.message);
    }
}


// //for send mail
const sendVerifyMail = async (name, email, user_id, otp) => {
    // const otp1=otp

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.MYEMAILIS,
                pass: process.env.SMTPPASSWORD
            }
        })
        const mailOptions = {
            from: process.env.MYEMAILIS,
            to: email,
            subject: 'for verification mail',
            html: `<P>Enter the OTP <b>${otp}</b> in the app to verify your email and complete the registration.<br>This OTP is expires in 1minutes</br></P>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email has been send :-', info.response);
            }
        })

        // const saltRounds = 10;

        // const hashedOTP = await bcrypt.hash(otp,saltRounds);
        // const newOTPVerification = await new OTP({
        //     userId:_id,
        //     otp:hashedOTP,
        //     createdAt:Date.now(),
        //     expiresAt:Date.now()+3600,
        // });
        //save otp record
        // await newOTPVerification.save();
    } catch (error) {
        console.log(error.message);
    }
}

const verifyOTP = async (req, res) => {
    try {
        console.log(req.body.otp+'it is otpppppppp')
        console.log(req.session.email + " is email")
        let storedotp = await OTP.findOne({email:req.session.email})
        // console.log('Stored', storedotp);
        // console.log('Stored OTP:', storedotp.otp);
        // console.log('Entered OTP:', req.body.otp);
        if(storedotp.otp==req.body.otp){ 
        
            const updateInfo = await users.updateOne({ email: req.session.email }, { $set: { is_verified: 1 } })
            // console.log(updateInfo +' verified');
            // const user= await users.findOne({email:req.session.email})
            // console.log(user,'user in verifyotp');
            // req.session.user_id=user._id
            // console.log(req.session.user_id,'req.session.user_id');
            res.render("user/homePage",{message :''})
            
        }else {
            // Render the OTP page with the error message
            res.render("user/OTP",{message:'OTP is not matched'});
        }
    } catch (error) {
        console.log(error.message)
    }
}


//Resend otp
const resendOTP = async (req,res)=>{
    try {
        // console.log('resendotp reached');
        const reOtp = otpGenerate()
        console.log(reOtp+' is the reOTP');
        console.log(req.session.email,'  email on session..');
        
        const id= await users.findOne({email:req.session.email})
        // console.log(id,'id in resendd otp');
        

        let saveReOtp = saveOtp(req.session.email,reOtp)
        // console.log(saveReOtp,'save re otp');
        let response = sendVerifyMail(id.name,req.session.email,id._id,reOtp)
        // console.log(response,'response in resend ot p');
        res.redirect('/OTP')

    } catch(error){
        console.log(error);
    }
}

const verifyLogin = async(req,res)=>{
    try{
        const email = req.body.email
        const password =req.body.password
        const userData = await users.findOne({email:email})

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password)
                if(passwordMatch){
                    if(userData.is_blocked==false){
                        if(!userData.is_verified){
                            const genotp = otpGenerate()
                            console.log(genotp + ' is the otp');
                            req.session.email = req.body.email
                            
                            let savingotp = saveOtp(req.body.email , genotp)
                            let response = sendVerifyMail(req.body.name, req.body.email, userData._id, genotp)
                            res.render('user/OTP', { message:'please verify your email' })
                        }else{
                            req.session.user_id=userData._id
                            res.render('user/homePage', {message:''})
                        }

                    }else{
                        console.log('admin is blocked you !..')
                        res.render('user/signIn', {message:'Admin is blocked You !..'})
                    }

                }else{
                    res.render('user/signIn', { message:'Password is incorrect' })
                }
            
        }else{
            res.render('user/signIn', { message:'Email  is incorrect' })
        }
    }catch(error){
        console.log(error);
    }
}

//Auth for Google with login
const successGoogleLogin = async (req,res)=>{
    console.log('google')
   
        res.render('user/homePage')
       
        // res.send('Welcome ',req.user.email)
    }



const failureGoogleLogin = async(req,res)=>{
    console.log('Error');
}

const loadShopPage = async(req,res)=>{
    try {
        const products = await product.find()

        res.render('user/shop',{products})
    } catch (error) {
        console.log(error)
    }
}

const loadProductDetails = async(req,res)=>{
    try {
       
       const productId = req.params.productId
       console.log(productId,' productId')
        const productdetails = await product.findOne({_id:productId})
        // console.log(productdetails+"it is productdetails")
        console.log('jhnjkbjhb');
        res.render('user/product',{productdetails})
    } catch (error) {
        console.log(error)
    }
}

const forgotPassword = async(req,res)=>{
    try {
        res.render('user/forgotPass',{message:''})
    } catch (error) {
        console.log(error)
    }
}

const resetPassword = async(req,res)=>{
    try {
       const theEmail = req.body.email
        const emailCheck = await users.findOne()
        if(emailCheck.theEmail){
            const genotp = otpGenerate()
            console.log(genotp + ' is the otp');

            let savingotp = saveOtp(emailCheck.userName , genotp)
            let response = sendVerifyMail(emailCheck.userName, emailCheck.email, emailCheck._id, genotp)
            req.flash('success', 'An OTP has been sent to your email. Please check your inbox.');

            res.redirect('/OTP')
        }else{
            req.flash('error', 'No user found with the provided email.');

            res.redirect('/forgot-password')
        }
    } catch (error) {
        console.log(error)
    }
}
    module.exports = {
        signIn,
        signUp,
        insertUser,
        getOtp,
        verifyOTP,
        homePage,
        verifyLogin,
        resendOTP,
        successGoogleLogin,
        failureGoogleLogin,
        loadShopPage,
        loadProductDetails,
        forgotPassword,
        resetPassword
        


    }