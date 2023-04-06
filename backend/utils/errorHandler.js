// This file is a function which si s resposible for error handling for all controller function

//First letter of the name of a class is always capital, here E in ErrorHandler
//Error is a class from which we are inheriting or we are extending Error class
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        // captureStackTrace is a predefine function of predefine class Error
        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = ErrorHandler