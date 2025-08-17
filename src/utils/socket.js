const crypto = require("crypto");
const socket = require("socket.io");
const { Chat } = require("../models/chat");
const createSecretRoomId = (userId,targetUserId)=>{
    return crypto.createHash("sha256").update([userId,targetUserId].sort().join("_")).digest("hex");
}
    
const initializeSocket =(server)=>{
    const io = socket(server,
    {
        cors:{origin:"http://localhost:5173"},
    })

io.on("connection",(socket)=>{
    socket.on("joinChat",({firstName,userId,targetUserId})=>{
        const roomId = createSecretRoomId(userId,targetUserId);
        //console.log(roomId);
        console.log(firstName+" joined"+ roomId);
        socket.join(roomId)

    })
    socket.on("sendMessage",async({ firstName,lastName,userId,targetUserId,newMessage})=>{
        const roomId = createSecretRoomId(userId,targetUserId);
        //console.log(firstName+" "+newMessage);
        //save the messages to DB
        try{
            let chat = await Chat.findOne({participants:{$all:[userId,targetUserId]},}); //finding among all users if chat already exists in DB
        
        if(!chat){
         chat = new Chat({participants:[userId,targetUserId],messages:[]})   
        }
        chat.messages.push({senderId:userId,text:newMessage})
        await chat.save();
        io.to(roomId).emit("message Received",{firstName,lastName,newMessage})            
    }
        catch(err){
            console.log(err);
        }
    })
    socket.on("disconnect",()=>{
        
    })
})
}

module.exports = initializeSocket;