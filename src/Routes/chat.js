const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middleware/authmiddleware");
const chatRouter = express.Router();

module.exports = {chatRouter};

chatRouter.get("/chat/:targetUserId", userAuth, async(req,res)=>{
    const{targetUserId} = req.params;
    const userId = req.user._id; //as we do userAuth we can get loggedInuserId from req.user
    try{
        let chat = await Chat.findOne({participants:{$all:[userId,targetUserId]}}).populate({path:"messages.senderId",select:"firstName lastName"});
        if(!chat){
            chat = new Chat({participants:[userId,targetUserId],messages:[]})
        }
        await chat.save();
        res.json(chat);
    }
    catch(err){
        console.log(err);
    }
})