
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt');
const app = express(); //creating new express js application or server or instance of the application
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async(req,res)=>{

    try{
    validateSignUpData(req);

    const {firstName,lastName,emailID,password} = req.body;
    const passwordhash = await bcrypt.hash(password,10);
    const user = new User({firstName,lastName,emailID,password:passwordhash}) //creating a new instance of User model
    await user.save();
    res.send("user added succesfully");
    }catch(err)
    {
        res.status(400).send("ERROR:"+err.message);
    }
})
const {userAuth} = require("./middleware/authmiddleware");


//login api
app.post("/login",async(req,res)=>{
    try{

        const {emailID,passwordInputByUser} = req.body;

        const user = await User.findOne({emailID});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        //console.log(user);
        const isPasswordValid = await user.validatePassword(passwordInputByUser);
        if(isPasswordValid){
            const token = await user.getJWT();
            //console.log(token);
            res.cookie("token",token,{expires: new Date(Date.now()+1*3600000)});
            res.send("User signin successfull");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err)
    {
        res.status(400).send("ERROR:"+err.message);
    }
})

//get profile
app.get("/profile",userAuth ,async (req,res)=>{ //if api call is made to profile first it goes to userAuth and the code will be executed 
// after user is verified and next is executed and then it comes here and execute below try block and req already has user object 

    try{
    const user = req.user;    
    res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }
})

//send connection request
app.post("/sendConnectionRequest",userAuth, async (req,res)=>{

    const user  = req.user;
    res.send(user.firstName+" sent a connection sent");
})

connectDB()
    .then(()=>{
        console.log("Connected to Database")
        app.listen(3000,()=>{
        console.log("server listens port 3000");
        }); //we can also have callback function once server is started
    }).catch((err)=>{
        console.error("Database connection failed",err);
    })


