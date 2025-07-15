const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/authmiddleware");
const User = require("../models/user");

//get profile
profileRouter.get("/profile",userAuth ,async (req,res)=>{ //if api call is made to profile first it goes to userAuth and the code will be executed 
// after user is verified and next is executed and then it comes here and execute below try block and req already has user object 

    try{
    const user = req.user;    
    res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }
})

module.exports = profileRouter;