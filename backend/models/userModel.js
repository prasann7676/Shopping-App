const mongoose = require("mongoose")
//Used to validate email, to see if an email is validate.
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
// we do not need to install crypto as it is builtin module
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Enter your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 5 characters"]
    },
    email:{
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8, "Name should have be greater than 4 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//These are schema functions.

//This function will run every time before saving any document.
//remember we cannot use this keyword inside arraow function, therefore, we need to use general function format.
userSchema.pre("save", async function(next){

    // This function will also run when document is updated
    // Therefore, when password is not changed (some other attribute like name etc is updates by the user)
    // Then we donot have to again hash the passsowd, it will be wrong.
    // This here represents the document which is being saved.
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
})

// JWT token
userSchema.methods.getJWTToken = function(){
    // JWT_SECRET is a secret key needed for jwt token
    // It should be secret, as if anyone knows this secret key, then those hackers can login with any other user credentials.

    // Sign function basically creates a token specific to the current user registered or logged in .
    // Token will have an id which is the user._id
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        // after this expiresIn time, the cookie will automatically expire
        // cookies are sessional user info stored, so that in that time, user need not to be logged in.
        expiresIn: process.env.JWT_EXPIRE,
    })
}

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    //this.password is the hashed Password
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){

    //Generating token of 20 bytes
    const resetToken = crypto.randomBytes(20).toString("hex")

    //Remeber we need to save these changes which we did using this.resetPasswordToken and this.resetPasswordExpire
    //we do it inside the userController forgotPassword function

    // Hashing the resetToken and adding this to userSchema(inside resetPasswordToken)
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // reset Password Expire is the time till which this resetToken will be valid.
    // here we set it to 15 min.
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken;
}

module.exports = mongoose.model("User",userSchema)
