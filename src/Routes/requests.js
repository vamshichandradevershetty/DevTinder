const express = require("express");
const connectionRequestRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middleware/authmiddleware");

//send connection request
connectionRequestRouter.post("/sendConnectionRequest",userAuth, async (req,res)=>{

    const user  = req.user;
    res.send(user.firstName+" sent a connection sent");
})

module.exports = connectionRequestRouter;