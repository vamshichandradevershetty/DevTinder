const express = require("express");

const app = express(); //creating new express js application or server or instance of the application

// will handle get calls to /user
app.get("/user",(req,res)=>{
    res.send({firstname:"user",lastname:"sample1"});
})

app.post("/user",(req,res)=>{
    console.log("data saved to db");
    res.send("data saved to Db");
})
app.delete("/user",(req,res)=>{
    res.send("data deleted successfully");
})


//this will match all the http method API Calls to /test
app.use("/test",(req,res)=>{
    res.send("hello from /test");
}); //this response will be send only when we are on path /test


app.listen(3000,()=>{
    console.log("server listens port 3000");
}); //we can also have callback function once server is started