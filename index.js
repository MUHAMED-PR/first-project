const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Ecom_1')


//------------------------------------

const express = require('express')
const path = require('path')
const nocache = require('nocache')
const dotenv=require('dotenv')
dotenv.config()
const  bodyParser = require('body-parser')
const flash = require('express-flash')
const app = express();
const sesion=require('express-session')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
const axios = require('axios')

app.set('view engine','ejs');

app.use(sesion({
    resave:false,
    saveUninitialized:true,
    secret:process.env.SESSION_SECRET
}));


app.use(express.static(path.join(__dirname,'public')))
app.use(flash())



const userRoute=require("./router/userRoute");
const adminRoute = require('./router/adminRoute');
const { session } = require('passport')



app.use('/',userRoute);
app.use('/admin',adminRoute);




app.listen(3000,()=>{
    console.log(`server is listening at http://localhost:3000`);
})
