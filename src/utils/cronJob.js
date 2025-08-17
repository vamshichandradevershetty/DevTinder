const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequests");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const User = require("../models/user");
const { set } = require("mongoose");
const sendemails = require("./sendEmail");

//this means run every day at 8am
cron.schedule("56 8 * * *",async ()=>{
try{
    const yesterday = subDays(Date(),1);
    const yesterdayStartOfDay = startOfDay(yesterday);
    const yesterdayEndOfDay = endOfDay(yesterday);
    const pendingRequests = await ConnectionRequest.find({
        status:"interested",
        createdAt:{
            $gte: yesterdayStartOfDay,
            $lt: yesterdayEndOfDay
        }
    }).populate("fromUserId toUserId");

    const listofEmails = [...new Set(pendingRequests.map(req=> req.toUserId.emailId))] //finding all the touserID emails and using set as set only returns unique values 
    // and i am storing in array and by using spread operator

    for(const email of listofEmails){
        //sendemails
        try{
        const res = await sendemails.run("New Friend request pending"+email,"requesting pending, please login and show your interest"); //1st paramter is subj and then body
        console.log(res);
    }
        catch(err){
            console.error(err.message);
        }
    }

}   
catch(err){
    console.error(err.message);
} 
})