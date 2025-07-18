const validator = require("validator");
const { validate } = require("../models/user");
const User = require("../models/user");
const profileEditData = (req)=>{
    const allowEdits=["firstName","lastName","age","gender","about","skills","photoUrl"];
    const iseditAllowed = Object.keys(req.body).every(field=>allowEdits.includes(field)) //object.keys gives keys from the req i.e., age,gender,about etc., checking from req.body for every field coming from req.body 
    // if it is included in allowedits or not
 return iseditAllowed;
}

const validateSignUpData = (req)=>{

    const {firstName,lastName,emailID,password} = req.body;

    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid");
    }
    else if(firstName.length < 4 || firstName.length > 50)
    {
        throw new Error("the name should contains min of 4 characters and not more than 50 characters");
    }
    else if(!validator.isEmail(emailID)){
        throw new Error("please enter valid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password");
    }
}


module.exports = {validateSignUpData,profileEditData};