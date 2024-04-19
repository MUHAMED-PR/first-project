const express = require('express')
const app = express()

app.set('view','../views/admin')


const adminDash = async(req,res)=>{
   try {
    console.log('admin reached.......')
    res.render('admin/dashboard')
   } catch (error) {
    console.log(error)
   } 
}


module.exports ={
    adminDash
}