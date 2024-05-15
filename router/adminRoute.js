const express = require('express')
const adminRoute = express.Router();
const path = require('path')
const session = require('express-session')
const adminController = require('../controllers/adminController')
const app = express()
const auth = require('../middleware/adminAuth')
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/admin'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage:storage})


app.set('views', '../views/admin');



adminRoute.get('/',adminController.adminLoad)
adminRoute.get('/login',adminController.adminLogin)
adminRoute.get('/dashboard',auth.isLogin,adminController.dashboard)
adminRoute.get('/customer',adminController.costumers)
adminRoute.get('/products',adminController.products)
adminRoute.get('/category',auth.isLogin,adminController.category)
adminRoute.post('/login',adminController.adminVerify)
adminRoute.get('/blockUser',adminController.UserBlock)
adminRoute.get('/loadaddCategory',adminController.loadaddCategory)
adminRoute.post('/addCategory',adminController.addCategory)
adminRoute.post('/updateCategory',adminController.updateCategory)
adminRoute.post('/listCategory',adminController.categoryListing)
adminRoute.get('/loadAddProduct',adminController.loadAddProduct)
adminRoute.post('/addProduct',adminController.addProduct)






module.exports = adminRoute;