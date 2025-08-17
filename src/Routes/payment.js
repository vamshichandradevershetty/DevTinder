const express = require("express");
const { userAuth } = require("../middleware/authmiddleware");
const paymentRouter = express.Router();

paymentRouter.post("/payment/create",userAuth,async (req,res,next)=>{
    
})

module.exports = paymentRouter;