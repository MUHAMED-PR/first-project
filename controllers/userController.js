// const { tryCatch } = require('engine/utils');
const users = require('../models/users')
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt')
const { tryCatch } = require('engine/utils')
const nodemailer = require('nodemailer')
require('dotenv').config()

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}


const signUp = (req, res) => {
    try {
        res.render('registration', { message: '' });
    } catch (error) {
        console.log(error);

    }
}
const otpGenerate =  (req,res) => {
    try {

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
        // console.log('emailExisting.....   '+emailExisting)

        if (emailExisting) {
            const message = 'This email is already registered!'
            return res.render('registration', { message: message })
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
        // console.log('userData....     '+userData)

        if (userData) {
            const genotp = otpGenerate()
            console.log(genotp + ' is the otp');
            req.session.email = req.body.email

            let savingotp = saveOtp(req.body.email , genotp)
            let response = sendVerifyMail(req.body.name, req.body.email, userData._id, genotp)

            const message = 'your registration has been successful'
            // res.render('registration',{message:message})

            res.render('OTP')
        }
        else {
            const message = 'your registration has been failed'
            res.render('registration', { message: message })
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


const verifyMail = async (req, res) => {
    try {
        console.log(req.body.otp+'it is otpppppppp')
        console.log(req.session.email + " is email")
        let storedotp = await OTP.findOne({email:req.session.email})
        if(storedotp.otp==req.body.otp){ 
        
        const updateInfo = await users.updateOne({ email: req.session.email }, { $set: { is_verified: 1 } })
        console.log(updateInfo+' verified');
        res.render("homePage")
    }else{
        let message = 'otp is not matched'
    }
}
catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    signUp,
    insertUser,
    verifyMail,
    // otpVerificationEmail,
    // homePage,


}