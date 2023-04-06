// if user is authenticated at this point

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel");

exports.isAuthenticated = catchAsyncErrors( async (req, res, next) => {
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to access this resource",401))
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    // req.user will now store this user, therefore we can access the current user detail using the req now.
    req.user = await User.findById(decodedData.id)

    //when we dont return its preferable to write next function to go to the next middleware in the current middleware stack
    next();
})

// checking if a user is having a role who can access a route or not.
exports.authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))
        }

        next();
    };
}