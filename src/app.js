const express = require("express");

const app = express(); //creating new express js application or server or instance of the application

app.use("/home",(req,res)=>{
    res.send("response from homepage");
});

app.use("/test",(req,res)=>{
    res.send("hello from /test");
}); //this response will be send only when we are on path /test

app.use("/",(req,res)=>{
    res.send("output from server");
});

app.listen(3000,()=>{
    console.log("server listens port 3000");
}); //we can also have callback function once server is started