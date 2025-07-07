/*
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
app.use("/test",(req,res)=>{ //route handler
    res.send("hello from /test");
}); //this response will be send only when we are on path /test

app.use("/admin",adminAuth);

app.get("/admin/getAllData",(req,res)=>{
    res.send('all data send');
})

app.get("/admin/Deletedata",(req,res)=>{
    res.send('data deleted');
})

app.get("/userData",userAuth,(req,res)=>{
    res.send("user data send");
})

app.get("/user/login",(req,res)=>{
    res.send("login successful");
})

app.get("/user",userAuth,(req,res,next)=>{
    next();
    //res.send('1st response');
});

app.get("/user",(req,res,next)=>{
    res.send('user fetched')
    next();
})
*/
