const mongoose = require('mongoose')

const otpVerificationSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now,
        expires:60
    }
});

module.exports = mongoose.model('OTP', otpVerificationSchema)