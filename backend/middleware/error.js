// A general class to handle error and give message and status code.
const ErrorHandler = require("../utils/errorHandler")

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong mongodb id error (cast error)
    // when during getting a product using /product/:id
    // we write an id which is very small(for ex - 4-5 characters)
    // Then mongodb knows, there exist no id no such small size
    if(err.name == "CastError"){
        const message = `Resource not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //Mongoose duplicate key error(for ex when a user registers with a already existing email id)
    if(err.code === 11000){
        // if lets say email is duplicate then${Object.keys(err.keyValue)} will be email
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400);
    }

    // Wrong JWT Token error
    if(err.name == "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandler(message,400);
    }

    //JWT Expire Error
    if(err.name == "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}