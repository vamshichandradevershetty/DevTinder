const express = require("express");
const { userAuth } = require("../middleware/authmiddleware");
const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();
const User = require("../models/user");


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

        }).populate("fromUserId","firstName lastName age gender about").populate("toUserId","firstName lastName age gender about");

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

userRouter.get("/feed",userAuth,async(req,res)=>{
try{
    //user should see all the cards
    //except his own card
    //connections he accepted
    //ignored connections
    //already sent connection requests
    const loggedInUser = req.user;
    const page = parseInt(req.query.page)||1;
    let limit  = parseInt(req.query.limit)||3;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    //find connection requests which are sent or received
    const connectionRequest = await ConnectionRequest.find({
        $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}] //checking connections which i have sent or which i have received
    }).select("fromUserId toUserId"); //
    
    const hideUserFromFeed = new Set(); //set always store unique data in it
    connectionRequest.forEach(req=>{
        hideUserFromFeed.add(req.fromUserId);
        hideUserFromFeed.add(req.toUserId);
    }) //finding the users whom i want to hide as i have sent requests or users which i have accepted or rejected
    
    const users = await User.find({
        $and:[
        {_id: {$nin: Array.from(hideUserFromFeed)}}, //here i am finding all the users who are not in hide users from feed 
        {_id: {$ne: loggedInUser._id}} //and also should not see my own card or profile
    ]
    }).select("firstName lastName gender about age _id").skip(skip).limit(limit);

    res.json(users);


}
catch(err){
    res.json({message:"ERROR: "+err.message});
}
})

module.exports = userRouter;