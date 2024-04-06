const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Ecom_1')


//------------------------------------

const express = require('express')
const path = require('path')
const nocache = require('nocache')
const dotenv=require('dotenv')
const  bodyParser = require('body-parser')
const flash = require('express-flash')
dotenv.config()
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs');

// Set the views directory
app.set('views','./views/user');


const userRoute=require("./router/userRoute");
// const adminRoute=require("./router/adminRoute");

app.use('/',userRoute);
app.use(express.static(path.join(__dirname,'public')))
app.use(flash())


app.listen(3000,()=>{
    console.log(`server is listening at http://localhost:3000`);
})