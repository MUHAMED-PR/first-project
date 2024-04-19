// const { tryCatch } = require('engine/utils');
const users = require('../models/users')
const OTP = require('../models/OTP')
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


const signUp = (req, res) => {
    try {
        res.render('user/registration', { message: '' });
    } catch (error) {
        console.log(error);

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

        let saveOtp = new OTP({
            email: email,
            otp: otp
        })
        await saveOtp.save();


    } catch (error) {
        console.log(error.message)
    }
}

//registration of a user
const insertUser = async (req, res) => {
    try {

        const emailExisting = await users.findOne({ email: req.body.email })
       

        if (emailExisting) {
            const message = 'This email is already registered!'
            return res.render('user/registration', { message: message })
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
            res.render('user/registration', { message:''})
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
        console.log('Stored OTP:', storedotp.otp);
        console.log('Entered OTP:', req.body.otp);
        if(storedotp.otp==req.body.otp){ 
        
            const updateInfo = await users.updateOne({ email: req.session.email }, { $set: { is_verified: 1 } })
            console.log(updateInfo +' verified');
            
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
        console.log('resendotp reached');
        const reOtp = otpGenerate()
        console.log(reOtp+' is the reOTP');
        

        let saveReOtp = saveOtp(req.session.email,reOtp)
        let response = sendVerifyMail(req.session.name,req.session.email,req.session._id,reOtp)

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
                    if(userData.is_verified===0){
                        res.render('user/registration',{message:'please verify your email'})
                    }else{
                        req.session.user_id=userData._id
                        res.redirect('/homePage')
                    }

                }else{
                    res.render('user/registration',{message:'Email and password is incorrect'})
                }
            
        }
    }catch(error){
        console.log(error);
    }
}

const userLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        console.log(email+' is the entered email...')
        const password = req.body.password;

            const userData = await users.findOne({email:email})
            if(userData){
                res.render('user/homePage',{message:''})
            }else{
                res.render('user/registration',{message:'Please Register'})
            }

        } catch(error){
            console.log(error);
        }
    }

    module.exports = {
        signUp,
        insertUser,
        verifyOTP,
        // otpVerificationEmail,
        homePage,
        verifyLogin,
        resendOTP,
        userLogin


    }