
const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require('bcrypt');
const app = express(); //creating new express js application or server or instance of the application

app.use(express.json());

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


//signin api
app.post("/signin",async(req,res)=>{
    try{

        const {emailID,password} = req.body;

        const user = await User.findOne({emailID});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        //console.log(user);
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid){
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


//delete a user from db
app.delete("/deleteuser",async(req,res)=>{

    const userId = req.body.userId;
    try
    {
        const user = await User.findByIdAndDelete(userId);
        res.send("deleted sucessfully");
    }
    catch(err)
    {
        res.status(400).send("somwthing went wrong"+err.message);
    }
})

//update  of the user by id
app.patch("/updateuser/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data  = req.body;
    try{

        const updateallowed = ["lastName","age","skills","password","about","gender"];
        const isupdateallowed = Object.keys(data).every((k) =>updateallowed.includes(k));

        if(!isupdateallowed){
            throw new Error("update not allowed");
        }
        if(data?.skills.length > 15)
        {
            throw new Error("Skills cannot be more than 15")
        }
        await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after",runValidators:true})
        res.send("update successfull");

    }
    catch(err){
        res.status(400).send("something went wrong:"+err.message);
    }
})

//update the user by email
app.patch("/updatebyemail",async(req,res)=>{
    const email = req.body.emailID;
    const data = req.body;
    try{
        const beforeupdate = await User.findOneAndUpdate({emailID:email},data,{returnDocument: 'before'});
        console.log(beforeupdate);
        res.send("update by email successfull");
    }
    catch(err){
        res.status(400).send("update request failed");
    }
})

//get user by email
app.get("/user",async (req,res)=>{

    const email = req.body.emailID;
    try{
    const user = await User.findOne({emailID:email});
    res.send(user);
    }
    catch(err){
        res.status(400).send("user not found",err);
    }
})
//get all the users from the database
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({}) //passing empty object to find gets all the details of user model
        res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }

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


