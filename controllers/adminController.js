const users= require('../models/users')
const bcrypt = require('bcrypt')
const adminDashboard = async(req,res)=>{
   try {
    console.log('admin reached.......')
    res.render('admin/dashboard')
   } catch (error) {
    console.log(error)
   } 
}
const adminVerify = async(req,res)=>{
    try {
        console.log('admin verify...');
        const email = req.body.email
        console.log(email,'email');
        const password = req.body.password
        console.log(password,'password');


        const adminData = await users.findOne({email:email, is_admin:1})
        console.log(adminData,'jsdsadk');

        if(adminData){
            const matchPassword = await bcrypt.compare(password,adminData.password);

            if(matchPassword){
                res.render('admin/dashboard')
            }
        }

       
    }
     catch (error) {
        console.log(error)
    }
}


const adminLogin = async(req,res)=>{
    try{
        res.render('admin/login')
    }catch(error){
        console.log(error)
    }
}

const costumer = async (req,res)=>{
    try{
        res.render('admin/customers');
    }catch(error){
        console.log(error);
    }
}

module.exports ={
    adminDashboard,
    adminLogin,
    costumer,
    adminVerify
}