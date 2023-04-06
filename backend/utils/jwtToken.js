// creating token and saving in cookie.
// This will indicate that a user is logged in as there exists a cookie with token
// which contain the sessional information(user._id) of the user logged in
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //option for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie("token",token,options).json({
        success: true,
        user,
        token
    })
}

module.exports = sendToken