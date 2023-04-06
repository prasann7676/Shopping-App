//in package.json inside script key, we specified 2 keys manually 
// 1). "start": "node backend/server.js" for production, so when we write npm start, server.js will run
// 2). "dev": "nodemon backend/server.js" for development phase, so by writing npm run dev, server.js will run using nodemon

const app = require("./app")
const cloudinary = require("cloudinary")

const connectDatabase = require("./config/database")

// Handling Uncaught exception
// for example we write console.log(value), but value is not define, so error
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1)
})

//we need dotenv to know from where(which location) are all environment variable(process.env.variable_name) are being accessed.
//config
if(process.env.NODE_ENV!=="production"){
    require("dotenv").config({path:"backend/config/config.env"})
}

//connecting to database
connectDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

//unhandled promise rejection
// So when there is an error(server crashing), before listening to the server, we quickly need to shutdown the server
// for example if we write the DB_URI wrong inside config/config.env.
process.on("unhandledRejection",(err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    //we shutdown the server and exit from the current on going process
    server.close(() => {
        process.exit(1)
    })
})