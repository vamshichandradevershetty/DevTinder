require("dotenv").config();
const express = require("express");
const cors = require("cors")
const connectDB = require("./config/database");
const app = express(); //creating new express js application or server or instance of the application
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const connectionRequestRouter = require("./Routes/requests");
const userRouter = require("./Routes/user");

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true}));
app.use("/",authRouter); // we can have app.use where it checks /authRouter and in goes to authRouter if signup or login is called 
app.use("/",profileRouter);//if there is a getprofile call express first checks that path is authRouter if it is valid it executes that else it comes for next path i.e., profileRouter
app.use("/",connectionRequestRouter);
app.use("/",userRouter);
connectDB()
    .then(()=>{
        console.log("Connected to Database")
        console.log(process.env.PORT);
        app.listen(process.env.PORT || 7777,()=>{
        console.log("server listens port 7777");
        }); //we can also have callback function once server is started
    }).catch((err)=>{
        console.error("Database connection failed",err);
    })


