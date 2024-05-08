const isLogin = async(req,res,next)=>{
    try {
        if(req.session.adminId){
            next()
        }else{
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error)
        res.render('Error-500');
    }
}


module.exports={
    isLogin
}