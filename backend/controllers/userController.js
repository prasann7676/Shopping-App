const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")
const cloudinary = require("cloudinary")


//Register a User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    })

    const {name,email,password} = req.body

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 200, res);
})

//Login User
exports.loginUser = catchAsyncErrors (async (req,res,next) => {
    const {email,password} = req.body

    //checking if user has given password and email both

    //If email or password is empty
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }

    sendToken(user,200,res);
})

//logout

exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})

// Forget password 
exports.forgotPassword = catchAsyncErrors ( async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404))
    }

    // Get resetPasswordToken
    const resetToken = user.getResetPasswordToken();

    //saving the changes in the document user, as we are assigning
    //resetPasswordToken and resetPasswordExpire inside getResetPasswordToken function
    await user.save({ validateBeforeSave: false })

    //req.protocol is http or https etc
    //req.get("host") will give us the domain name, for ex - in local it is localhost:4000


    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    //For just testing purpose we are changing the resetPasswordUrl as backend on port 4000 and frontend 3000
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`


    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`

    try{
        await sendEmail({
            email: user.email,
            subject: `Shopping Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch(error) {
        // IF there is an error then make both resetPassword field as undefined
        // and save the changes in the database
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false})
        // console.log("is it this?")
        return next(new ErrorHandler(error.message, 500))
    }
})


//reseting Password after getting a mail after forgot password.
exports.resetPassword = catchAsyncErrors ( async (req, res, next) => {
    // We will find the hashed token(hashed using cypto and sha256) in the database
    // as it was saved inside the resetPasswordToken attribute

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    //we will get a user corresponding to this resetPasswordToken and whose token expiry time is greater than the current time.
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: {$gt: Date.now()} })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 401))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match the confirm Password", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user,200,res)
})

//Get User Detail
//will also be used to solve reloading problem, to retrieve currently logged in user after reloading the page.
exports.getUserDetails = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

//update User Password
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",401))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",401))
    }


    //so before saving this document change again, password would be first hashed and then saved in the database
    //due to userSchema.pre function in userModel
    user.password = req.body.newPassword

    await user.save()

    res.status(200).json({
        success: true,
        user
    })

    sendToken(user,200,res)
})

//update User Profile
exports.updateProfile = catchAsyncErrors(async (req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //we will add cloudinary later(when we will see frontend part)
    //Added after some frontend setups and works are done
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
        
        //Delete the previously uploaded avatar for the user's profile
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
        
        //updated avatar
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true
    })
})

// Get all users -- Admin
exports.getAllUser = catchAsyncErrors(async (req,res,next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
})

//Get single user details(admin) --Admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400))
    }

    res.status(200).json({
        success: true,
        user
    })
})

//update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    //we will add cloudinary later(when we will see frontend part)

    await User.findByIdAndUpdate(req.params.id, newUserData,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true
    })
})

//Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req,res,next) => {

    const user = await User.findById(req.params.id)

    console.log("userControllers", user)
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    //we will delete cloudinary later(when we will see frontend part)
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await User.deleteOne(user)

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})

