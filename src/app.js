
const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");
const User = require("./models/user");
const app = express(); //creating new express js application or server or instance of the application

app.use(express.json());

app.post("/signup", async(req,res)=>{


    const user = new User(req.body) //creating a new instance of User model
    
    try{
    await user.save();
    res.send("user added succesfully");
    }catch(err)
    {
        res.status(400).send("error saving user:",err.message);
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
        res.status(400).send("somwthing went wrong");
    }
})

//update  of the user by id
app.patch("/updateuser",async(req,res)=>{
    const userId = req.body.userId;
    const data  = req.body;
    try{
        await User.findByIdAndUpdate({_id:userId},data)
        res.send("update successfull");

    }
    catch(err){
        res.status(400).send("something went wrong");
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


