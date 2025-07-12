const validator = require("validator");

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

module.exports = {validateSignUpData};