const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/authmiddleware");
const {profileEditData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const e = require("express");
//get profile
profileRouter.get("/profile/view",userAuth ,async (req,res)=>{ //if api call is made to profile first it goes to userAuth and the code will be executed 
// after user is verified and next is executed and then it comes here and execute below try block and req already has user object 

    try{
    const user = req.user;    
    res.send(user);
    }
    catch(err){
        res.status(400).send("Something went wrong"+err.message);
    }
})

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try{
        if(!profileEditData(req))
        {
            throw new Error("invalid edit request")
        }
        const loggedinUser = req.user;
        console.log(loggedinUser);
        Object.keys(req.body).forEach((key)=> (loggedinUser[key]=req.body[key])); //passing column names as key coming from req.body and for each key i am updating loggedinuser value with values from req.body
        await loggedinUser.save();
        console.log(loggedinUser);
        res.json({message:`${loggedinUser.firstName}, your profile updated successfully`,
            data: loggedinUser})
    }
    catch(err){
        res.send("Something went wrong: "+err.message);
    }
})

profileRouter.patch("/profile/updatepassword",userAuth, async(req,res)=>{
    try{
    const loggedinUser = req.user;   
    const existingpasswordmatched = await bcrypt.compare(req.body.existingpassword,loggedinUser.password);
    if(!existingpasswordmatched){
        throw new Error("password not matched");
    }
    else{
        console.log("existing password same as DB"); 
        const {newpassword,reenterpassword} = req.body;
        if(newpassword !== reenterpassword)
        {
             throw new Error("password does not match");
        }
        if(validator.isStrongPassword(newpassword)){
            const newpasswordhash = await bcrypt.hash(newpassword,10);
            loggedinUser.password = newpasswordhash;
            await loggedinUser.save();
            console.log(loggedinUser);
        }
        else{
                throw new Error("Enter Strong password");
            }
    }
    res.send("password Updated");
    }
    catch(err){
        res.send("Something went wrong: "+err.message);
    }
})
module.exports = profileRouter;