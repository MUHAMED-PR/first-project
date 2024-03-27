// const { tryCatch } = require('engine/utils');
const users = require('../models/users')
const bcrypt = require('bcrypt')
const { tryCatch } = require('engine/utils')
const nodemailer = require('nodemailer')


const securePassword = async (password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}


const signUp = (req,res)=>{
    try {
        res.render('registration');
    } catch (error) {
        console.log(error);
        
    }
}

const insertUser = async(req,res)=>{
    try{
       
        const emailExisting = await users.findOne({email:req.body.email})
        // console.log('emailExisting.....   '+emailExisting)

    if(emailExisting){
        const message = 'This email is already registered!'
        return res.render('registration',{message:message})
    }
    const spassword = await securePassword(req.body.password)
    // console.log('spassword.....     '+spassword)

    const user= new users({
        userName:req.body.name,
        email:req.body.email,
        password:spassword,
        cpassword:spassword,
        mobile:req.body.mobile
    })
    const userData = await user.save()
    // console.log('userData....     '+userData)

    if(userData){
        sendVerifyMail(req.body.name,req.body.email,userData._id)
        const message='your registration has been successful'
        res.render('registration',{message:message})
    }
    else{
        const message='your registration has been failed'
        res.render('registration',{message:message})
    }

    } catch (error){
        console.log(error.message);
    }
}

//for send mail
const sendVerifyMail = async(name,email,user_id)=>{

    try {
       const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'muhamed@gmail.com',
                pass:process.env.SMTPPASSWORD
            }
        })
        const mailOptions = {
            from:'muhamed@gmail.com',
            to:email,
            subject:'for verification mail',
            html:'<p>Hii '+name+', please click here to < herf="http://localhost:3000/verify?id='+user_id+'"> Verify </a> your mail.<p/>'
        }
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log('Email has been send :-',info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async(req,res)=>{
    try {
        const updateInfo = await users.updateOne({_id:req.query.id},{$set:{is_verified:1}})
    } catch (error) {
        console.log(error.message)
    }
}




module.exports={
    signUp,
    insertUser,
    verifyMail

}