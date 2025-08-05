const mongoose = require("mongoose");


const connectDB = async () => {

    await mongoose.connect("mongodb+srv://vamshi:jVhCidNXFfimti6h@nodepractice.rwcjzvn.mongodb.net/devTinder");
}


module.exports = connectDB;

    

