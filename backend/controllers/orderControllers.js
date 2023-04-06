const Order = require("../models/orderModels")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors( async (req, res, next) => {
    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})

// get Single Order
// Populate is used here because in Order collection, for each order only id of a user is stored
// Therefore, if we want the name and email of that particular user(with given userId in Order collection)
// we can use populate, this will go in the User collection and also bring the name and email of the user with the given user id.
exports.getSingleOrder = catchAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get all orders related to a logged in user
exports.myOrders = catchAsyncErrors( async (req, res, next) => {
    //both req.user.id or req.user._id can be written
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        success: true,
        orders
    })
})


//Get all orders --Admin
exports.getAllOrders = catchAsyncErrors( async (req, res, next) => {
    //both req.user.id or req.user._id can be written
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Update Order Status --Admin
exports.updateOrder = catchAsyncErrors( async (req, res, next) => {
    //both req.user.id or req.user._id can be written
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }

    //If order has already been delivered
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400))
    }

    //Order status may be processing, shipped or delivered
    //so, first, admin will always make the status fro prcessing to shipped then shipped to delivered
    //Therefore, we need to update number of stocks left(when order is shipped, stock of that product should be reduced)
    //But once shipped, we have already decreasedthe stock, so when delivered stock should not change(as it has already been handled when order for the product was shipped)
    //Therefore, we only need to update the stock when shipped.
    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async (o)=>{
            await updateStock(o.product, o.quantity)
        })
    }

    order.orderStatus = req.body.status

    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({validateBeforeSave: false})
    res.status(200).json({
        success: true,
    })
})

//update the stock of a particular product
//id is the product id and quantity is the quantity ordered of that particular product while ordering it
async function updateStock(id, quantity){
    const product = await Product.findById(id)

    product.stock -= quantity

    await product.save({validateBeforeSave: false})
}

//delete order --Admin
exports.deleteOrder = catchAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }

    await Order.deleteOne(order)

    res.status(200).json({
        success:true
    })
})