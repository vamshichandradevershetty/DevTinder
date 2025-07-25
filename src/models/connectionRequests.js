const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
        fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User", //creating reference to the user collection
        required:true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{values:["ignored","accepted","rejected","interested"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {timestamps:true,}
);
connectionRequestSchema.index({fromUserId: 1,toUserId: 1})//1 indicates compound create index on fromuserid,toUserid in ascending order
//the above one is helpful to query faster on the collection using from and touserid if our collection grows
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send to yourself");
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports  = ConnectionRequest;