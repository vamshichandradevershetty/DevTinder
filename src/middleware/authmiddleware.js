const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth =async (req,res,next)=>{
    //read the token from request
    try{
    const {token} = req.cookies;
    if(!token)
        {
            return res.status(401).send("UnAuthorized Access, Please Login");
        }
    const decodedObj = await jwt.verify(token,"DevTinder@123");

    //  validate it
    const {_id} = decodedObj;

    //  find the user
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user; //after user is found it is attached to request.user 
    next();
    }
    catch(err){
        res.status(400).send("Bad Request:"+err.message);
    }
}
module.exports = {userAuth};