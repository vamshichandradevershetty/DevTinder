const express = require("express");
const { userAuth } = require("../middleware/authmiddleware");
const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();

//getting all the pending connection requests for the loggedin user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status: "interested"
    //}).populate("fromUserId",["firstName","lastName"]); //if we dont pass the array fields it will show the entire user data including email and password so we only show fistname and lastname right now
    }).populate("fromUserId","firstName lastName"); //both are same as above
    res.json({message:"pending requests ",data:connectionRequests})

    }
    catch(err){
        res.status(400).json({message:"Something went wrong "+err.message});
    }
})

//getting all the connections
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ],

        }).populate("fromUserId","firstName lastName gender").populate("toUserId","firstName lastName gender");

        const data = connections.map(row=>{
           if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId; //if user is verified that connection send by him then in returns the details of users connected to him
           }
           return row.fromUserId;
    });//here instead of sending all the details i am only sending the data of from userId which only has firstName, lastname and gender
        res.send({data:data});
    }
    catch(err){
        res.status(400).json({message:"ERROR"+err.message});
    }

})


module.exports = userRouter;