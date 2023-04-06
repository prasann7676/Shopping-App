//This file is used to import routes for route managing and also including all middlewares using use function.
const express = require("express")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const path = require("path");

// app can be said server, if not used express here we need to 
// write createServer function which sould return this app variable.
const app = express()
const errorMiddleware = require("./middleware/error")

//config
if(process.env.NODE_ENV!=="production"){
    require("dotenv").config({path:"backend/config/config.env"})
}

// This use is requires to use send response in json format from the server
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())


//Route imports
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoutes")
const payment = require("./routes/paymentRoute")

// use is used to indicate that we are going to use middlewares
// "/api/v1" we be prefix for all the routes we specify from now
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", payment)

//after npm run build, inside build folder, index.html is our main file
app.use(express.static(path.join(__dirname, "../frontend/build")));


//For all url index.html will be returec, and thru that, all other components will be rendered
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
}); 

//middleware for error
app.use(errorMiddleware)

module.exports = app