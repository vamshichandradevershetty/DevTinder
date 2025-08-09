const express = require("express");
const connectionRequestRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middleware/authmiddleware");
const ConnectionRequest = require("../models/connectionRequests");

const sendEmail = require("../utils/sendEmail");


//send connection request
connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"invalid status type: "+status}); //if we don't write return it will move ahead and execute next lines
    }

    const isUserexists = await User.findById(toUserId);
    if(!isUserexists){
        return res.status(404).json({message:"User not found"});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId},
        ]
    }) 
    if(existingConnectionRequest){
        return res.status(400).json({message:"Connection request already exists"});
    }

    const connectionRequest = new ConnectionRequest({fromUserId,toUserId,status})

    const data = await connectionRequest.save();
    const emailres = await sendEmail.run();
    console.log(emailres);
    res.json({message:req.user.firstName+" "+req.user.lastName+" "+status+" in "+isUserexists.lastName,data});
}

catch(err){
    res.status(400).send(err.message);
}
})


connectionRequestRouter.post("/request/review/:status/:requestID",userAuth,async(req,res)=>{
    try{
        const {status,requestID} = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({messsage:"status not allowed"}+status);
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestID,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest){
           return res.status(404).json({message:"Request not found"});
        }
        connectionRequest.status = status //here the status is coming from api which is either can be accepted or rejected and we already validated the status to be interested to perform this action
        //now we update the status in DB
        const data = await connectionRequest.save();

        res.json({message:"Connection request:"+status,data});
    }  
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = connectionRequestRouter;