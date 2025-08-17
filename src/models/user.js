const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName:{type:String,required:true,minlength:4},
    lastName:{type:String},
    emailID:{
        type:String,required:true,unique:true,lowercase:true,
        validate(value){
            if(!validator.isEmail(value))
                {
                    throw new Error("enter valid email");
                }
        }
    },
    password:{
        type:String,required:true,
         validate(value){
            if(!validator.isStrongPassword(value))
                {
                    throw new Error("please enter strong password");
                }
        }
    },
    age:{type:Number,min:18,max:100},
    gender:{
    type:String,validate(value){
    if(!["male","female","others"].includes(value))
    {
        throw new Error("Gender is not valid");
    }
    }},
    photoUrl:{type:String},
    about:{type:String,default:"This is default about registered users"},
    skills:{type:[String]}
},{timestamps:true})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = jwt.sign({_id:user.id},"DevTinder@123",{expiresIn:"8d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);

module.exports = User;