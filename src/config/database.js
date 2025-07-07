const mongoose = require("mongoose");


const connectDB = async () => {

    await mongoose.connect("mongodb+srv://vamshi:LtYv6K4jdOtKdLrB@nodepractice.rwcjzvn.mongodb.net/devTinder");
}


module.exports = connectDB;

    

