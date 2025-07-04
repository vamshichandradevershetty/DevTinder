 const adminAuth = (req,res,next)=>{
    console.log('admin auth getting checked');
    const token = 'xyz';
    const authorized = token === 'xyz';
    if(!authorized)
    {
        res.status(401).send('admin not verified');
    }
    else{
        next();
    }
}
 const userAuth = (req,res,next)=>{
    console.log("user is being checked");
    const token = 'xyz';
    const isauthorized = token === 'xyz';
    if(!isauthorized)
    {
        res.status(401).send("user not authorized");
    }
    else{
        next();
    }
}

module.exports = {adminAuth,userAuth};