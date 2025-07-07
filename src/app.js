
const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");
const User = require("./models/user");
const app = express(); //creating new express js application or server or instance of the application

app.post("/signup", async(req,res)=>{

    const user = new User({
        firstName:"sampleuser",
        lastName:"two",
        emailID:"sampleusertwo@gmail.com",
        password:"sampleuser@456",
        age: 27
    }) //creating a new instance of User model
    
    try{
    await user.save();
    res.send("user added succesfully");
    }catch(err)
    {
        res.status(400).send("error saving user:",err.message);
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


