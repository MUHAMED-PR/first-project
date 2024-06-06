const cartModel = require('../models/cart')
const product = require('../models/product')



const loadcart = async (req, res) => {
    try {

        const cart = await cartModel.findOne({ userId: req.session.user_id }).populate('product.productId').exec()
        // console.log(cart,'ost dfsf')
        if (!cart) {
            res.render('user/cart', { cart: [], product: [] })
        }

        res.render('user/cart', { cart: cart.product })
    } catch (error) {
        console.log(error);
    }

}

//adding product to cart
const addToCart = async (req, res) => {
    try {

        const { user_id } = req.session
        const { productId } = req.body
        // console.log(productId, 'it is produ')

        const existing = await cartModel.find({ userId: user_id })
        if (existing.length == 0) {

            console.log(user_id)

            const addingCart = new cartModel({
                userId: user_id,
                product: [
                    {
                        productId: productId
                    }
                ]
            })

            let added = await addingCart.save()
            console.log(added)

        } else {
            console.log("it is else")
            const existProduct = await cartModel.find({ $and: [{ 'product.productId': productId }, { userId: user_id }] })
            if (existProduct.length == 0) {
                console.log('it flsfsdfsd')
                const addnewpr = await cartModel.updateOne(
                    { userId: user_id },
                    { $addToSet: { 'product': { productId: productId } } }
                );

                console.log(addnewpr)
            } else {

                res.json({ status: 'existing' })
            }
        }

    } catch (error) {
        console.log(error)
    }
}

const removeCart = async (req, res) => {
    try {

        console.log('productID')
        const { productID } = req.params
        console.log(productID)
        const { user_id } = req.session
        console.log(user_id)
        const removing = await cartModel.updateOne(
            { userId:user_id},
            { $pull: { product: { _id: productID } } }
        );

        console.log(removing)
        res.json({ status: true })


    } catch (error) {
        console.log(error)
    }
}


const productQuantity = async (req, res) => {
    try {
        const { currentQuantity, productId } = req.body
        const { user_id } = req.session

        console.log(currentQuantity, productId, ' is the quantity')
        const editedQuantity = await cartModel.updateOne(
            { "product._id": productId },
            { $set: { "product.$.quantity": currentQuantity } }
        )
        console.log(editedQuantity)
        const cartDocument = await cartModel.findOne({ userId: user_id }).populate('userId').populate({
            path: 'product',
            populate: { path: 'productId' }
        })
        res.json({ cartDocument })



    } catch (error) {
        console.log(error)
    }
}





module.exports = {
    loadcart,
    addToCart,
    removeCart,
    productQuantity
}