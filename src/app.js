
const express = require("express");
const connectDB = require("./config/database");
const app = express(); //creating new express js application or server or instance of the application
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const connectionRequestRouter = require("./Routes/requests");

app.use("/",authRouter); // we can have app.use where it checks /authRouter and in goes to authRouter if signup or login is called 
app.use("/",profileRouter);//if there is a getprofile call express first checks that path is authRouter if it is valid it executes that else it comes for next path i.e., profileRouter
app.use("/",connectionRequestRouter);

connectDB()
    .then(()=>{
        console.log("Connected to Database")
        app.listen(3000,()=>{
        console.log("server listens port 3000");
        }); //we can also have callback function once server is started
    }).catch((err)=>{
        console.error("Database connection failed",err);
    })


