const users = require('../models/users')
const categoryModel = require('../models/category')
const productModel = require('../models/product')
const bcrypt = require('bcrypt')


const adminLoad = async(req,res)=>{
   try {
    // console.log('admin reached.......')
    const userData = await users.find()
    res.render('admin/login',{admin:userData})
   } catch (error) {
    console.log(error)
   } 
}
const adminVerify = async(req,res)=>{
    try {
        // console.log('admin verify...');
        const email = req.body.email
        console.log(email,'email');
        const password = req.body.password
        // console.log(password,'password');


        const adminData = await users.findOne({email:email, is_admin:1})
        // console.log(adminData,' is adminData');

        if(adminData){
            const matchPassword = await bcrypt.compare(password,adminData.password);

            if(matchPassword){
                req.session.adminId=adminData._id
                res.render('admin/dashboard')
            }else{
                res.render('admin/login', {message:'Incorrect Password'})
            }
        }else{
            res.render('admin/login', {message:'Incorrect Email'})

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


const dashboard = async(req,res,next)=>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error);
    }
}


const costumers = async (req,res)=>{
    try{
        const customers= await users.find()
        // console.log(customers,'customers');
        res.render('admin/customers',{customers});
    }catch(error){
        console.log(error);
    }
}

// handle blocking and unblocking users
const UserBlock = async (req, res) => {
    try {
        // console.log('reached at userblock!!!!!!!!!!!');

        const userId = req.query.id; // Get the user ID from the request
        // console.log(userId,'  userId');
        const user = await users.findById(userId); // Find the user by ID

      
       if(!user.is_blocked){
        await users.findByIdAndUpdate({_id:user._id},{$set:{is_blocked:true}}) 
       }else{
        await users.findByIdAndUpdate({_id:user._id},{$set:{is_blocked:false}})
       }


        return res.status(200).json({ message: "User block status updated successfully", user: user });
    } catch (error) {
        console.error("Error toggling user block status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const products = async (req,res)=>{
    try{
        let product  = await  productModel.find()
        console.log(product)
        res.render('admin/products',{product})
    }catch(error){
        console.log(error)
    }
}

const category = async (req,res)=>{
    try{
        const category = await categoryModel.find() 
        res.render('admin/category',{category})
    }catch(error){
        console.log(error);
    }
}

const loadaddCategory = async(req,res)=>{
    try {
        res.render('admin/addCategory')
        // console.log('reached to addcattegory.....');

    } catch (error) {
        console.log(error);
        // res.render()
    }
}

const addCategory = async(req,res)=>{
    try {
        // console.log('started to adding cattegory.....');
        const {categoryName,description} = req.body
        const regex = new RegExp(categoryName,"i")
        const exstingCategory = await categoryModel.findOne({categoryName:regex})
        if(exstingCategory){
            return res.render('admin/addCategory',{ message: 'Category already exists!' })
        }
        // console.log('existing section overxxx')

        const newCategory =new categoryModel({
            categoryName:categoryName,
            description:description  
        })
        // console.log('newCategory section also passed');

        const savedCategory = await newCategory.save()
        // console.log(savedCategory,'  savedCategory');

        if(savedCategory){
            res.render('admin/addCategory',{ message: 'Category  Added' })
        }else{
            res.render('admin/addCategory',{ message:'Category doesnot added'})
        }

    } catch (error) {
        console.log(error);
        res.render('admin/addCategory',{ message:'505 internal server error!'})
    }
}

const loadAddProduct = async(req,res)=>{
    try {
        const category= await categoryModel.find()
        res.render('admin/addProduct',{category})
    } catch (error) {
        console.log(error)
    }
}

const addProduct = async(req,res)=>{
    try {
        const {productName,category,
            productPrice,productQuantity,description,
            image1,image2,image3,image4} = req.body

            const regex = new RegExp(productName,"i")
            const existingProduct = await productModel.find({productName:regex})
            // const categoryModels = await categoryModel.find()
            // if(existingProduct){
            //     res.render('admin/addProduct', {message:'Product name is already existed!',categoryModels})
            // }
            const newProduct = new productModel({
                name:productName,
                price:productPrice,
                quantity:productQuantity,
                images:[image1,image2,image3,image4],
                description,
                category:category

            })
           let products  =  await newProduct.save()
           console.log(products+"toduckldfdlfkl")
            res.redirect('/admin/products')
    } catch (error) {
        console.log(error)
    }
}
module.exports ={
    adminLoad,
    adminLogin,
    dashboard,
    costumers,
    UserBlock,
    adminVerify,
    products,
    category,
    loadaddCategory,
    addCategory,
    loadAddProduct,
    addProduct
}