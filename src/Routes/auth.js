const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');


authRouter.post("/signup", async(req,res)=>{ //same as app.post

    try{
    validateSignUpData(req);

    const {firstName,lastName,emailID,password} = req.body;
    const passwordhash = await bcrypt.hash(password,10);
    const user = new User({firstName,lastName,emailID,password:passwordhash}) //creating a new instance of User model
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    //console.log(token);
    res.cookie("token",token,{expires: new Date(Date.now()+6*3600000)});
    res.json({message:"user added succesfully",data:savedUser});
    }catch(err)
    {
        res.status(400).send("ERROR:"+err.message);
    }
})


//login api
authRouter.post("/login",async(req,res)=>{
    try{

        const {emailID,password} = req.body;
        
        const user = await User.findOne({emailID});
        if(!user){
            return res.status(400).send({error:"Invalid Credentials"});
        }
        //console.log(user);
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            //console.log(token);
            res.cookie("token",token,{expires: new Date(Date.now()+6*3600000)});
            res.send(user);
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err)
    {
       return res.status(400).send({error:err.message});
    }
})



authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now()),});
    res.send("LogOut Successful");
})

module.exports = authRouter;
