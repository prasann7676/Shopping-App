// this file is responsible for handling async await errors.
module.exports = theFunc => (req,res,next) => {
    //Promise is a predefines class
    //resolve can be said as the then block and catch is catch
    Promise.resolve(theFunc(req,res,next)).catch(next)
}