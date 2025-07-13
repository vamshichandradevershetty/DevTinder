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
//delete a user from db
app.delete("/deleteuser",async(req,res)=>{

    const userId = req.body.userId;
    try
    {
        const user = await User.findByIdAndDelete(userId);
        res.send("deleted sucessfully");
    }
    catch(err)
    {
        res.status(400).send("somwthing went wrong"+err.message);
    }
})

//update  of the user by id
app.patch("/updateuser/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data  = req.body;
    try{

        const updateallowed = ["lastName","age","skills","password","about","gender"];
        const isupdateallowed = Object.keys(data).every((k) =>updateallowed.includes(k));

        if(!isupdateallowed){
            throw new Error("update not allowed");
        }
        if(data?.skills.length > 15)
        {
            throw new Error("Skills cannot be more than 15")
        }
        await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after",runValidators:true})
        res.send("update successfull");

    }
    catch(err){
        res.status(400).send("something went wrong:"+err.message);
    }
})

//update the user by email
app.patch("/updatebyemail",async(req,res)=>{
    const email = req.body.emailID;
    const data = req.body;
    try{
        const beforeupdate = await User.findOneAndUpdate({emailID:email},data,{returnDocument: 'before'});
        console.log(beforeupdate);
        res.send("update by email successfull");
    }
    catch(err){
        res.status(400).send("update request failed");
    }
})

//get user by email
app.get("/user",async (req,res)=>{

    const email = req.body.emailID;
    try{
    const user = await User.findOne({emailID:email});
    res.send(user);
    }
    catch(err){
        res.status(400).send("user not found",err);
    }
})
//get all the users from the database
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({}) //passing empty object to find gets all the details of user model
        res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }

})

